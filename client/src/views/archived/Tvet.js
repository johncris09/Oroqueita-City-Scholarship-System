import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFileExcel, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import api from 'src/components/Api'
import { DefaultLoading } from 'src/components/Loading'
import { EditSharp } from '@mui/icons-material'
import {
  Address,
  CivilStatus,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
  handleExportTvetData,
  handleExportTvetRows,
  tvetDefaultColumn,
} from 'src/components/DefaultValue'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'
import moment from 'moment'
import { toSentenceCase } from 'src/components/FormatCase'
import { calculateAge } from 'src/components/GetAge'

const Tvet = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [editValidated, setEditValidated] = useState(false)
  const [course, setCourse] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
    fetchSchool()
    fetchCourse()
  }, [])

  const fetchSchool = () => {
    api
      .get('college_school')
      .then((response) => {
        setSchool(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const fetchCourse = () => {
    api
      .get('course')
      .then((response) => {
        setCourse(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }
  const fetchData = () => {
    api
      .get('tvet/get_by_status', {
        params: {
          status: 'archived',
        },
      })
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(HandleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
  }

  const handleEditApplicationInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text') {
      form.setFieldValue(name, toSentenceCase(value))
    } else {
      form.setFieldValue(name, value)
    }

    if (type === 'date') {
      form.setFieldValue('age', calculateAge(value))
    }
  }

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('tvet/get_all_by_status', {
        params: {
          status: 'archived',
        },
      })
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(HandleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }
  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    // validationSchema: validated,
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoadingOperation(true)
        setLoading(true)
        await api
          .get('tvet/filter_by_status', {
            params: {
              ...values,
              status: 'archived',
            },
          })
          .then((response) => {
            setData(decrypted(response.data))
            setValidated(false)
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
            setLoading(false)
          })
      } else {
        console.warn('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingOperation(true)
    filterForm.resetForm()
    fetchData()
  }

  const form = useFormik({
    initialValues: {
      app_no_year: '',
      app_no_sem: '',
      app_no_id: '',
      firstname: '',
      lastname: '',
      middle_initial: '',
      suffix: '',
      address: '',
      birthdate: '',
      age: '',
      civil_status: '',
      sex: '',
      contact_number: '',
      ctc_number: '',
      email_address: '',
      availment: '',
      school: '',
      course: '',
      school_address: '',
      year_level: '',
      semester: '',
      hour_number: '',
      school_year: '',
      father_name: '',
      father_occupation: '',
      mother_name: '',
      mother_occupation: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = [
        'middle_initial',
        'suffix',
        'age',
        'email_address',
        'father_name',
        'father_occupation',
        'mother_name',
        'mother_occupation',
        'school_address',
        'contact_number',
      ]

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        // Check if the field is non-optional and not empty
        return nonOptionalFields.includes(key) || !!values[key]
      })
      if (allNonOptionalFieldsNotEmpty) {
        setLoadingOperation(true)
        await api
          .put('tvet/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            setEditValidated(false)
            setEditModalVisible(false)
          })
          .catch((error) => {
            console.info(error)
            // toast.error(HandleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
          })
      } else {
        toast.warning('Please fill in all required fields.')
        setEditValidated(true)
      }
    },
  })
  return (
    <>
      <ToastContainer />
      <CRow className="justify-content-center">
        <CCol md={6}>
          <h5>
            <FontAwesomeIcon icon={faFilter} /> Filter
          </h5>
          <CForm
            id="filterForm"
            className="row g-3 needs-validation mb-4"
            noValidate
            validated={validated}
            onSubmit={filterForm.handleSubmit}
          >
            <RequiredFieldNote />

            <CRow className="my-1">
              <CCol md={6}>
                <CFormSelect
                  feedbackInvalid="Semester is required."
                  label={RequiredField('Semester')}
                  name="semester"
                  onChange={handleInputChange}
                  value={filterForm.values.semester}
                  required
                >
                  <option value="">Select</option>
                  {Semester.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  feedbackInvalid="School Year is required."
                  label={RequiredField('School Year')}
                  name="school_year"
                  onChange={handleInputChange}
                  value={filterForm.values.school_year}
                  required
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="justify-content-between mt-1">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="danger" size="sm" variant="outline" onClick={handleRemoveFilter}>
                  <FontAwesomeIcon icon={faCancel} /> Remove Filter
                </CButton>
                <CButton size="sm" variant="outline" color="primary" onClick={handleViewAllData}>
                  <FontAwesomeIcon icon={faEye} /> View All Data
                </CButton>
                <CButton color="primary" size="sm" type="submit">
                  <FontAwesomeIcon icon={faFilter} /> Filter
                </CButton>
              </div>
            </CRow>
          </CForm>

          {loadingOperation && <DefaultLoading />}
          <hr />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <MaterialReactTable
            columns={tvetDefaultColumn}
            data={data}
            enableRowVirtualization
            enableColumnVirtualization
            state={{
              isLoading: loading,
              isSaving: loading,
              showLoadingOverlay: loading,
              showProgressBars: loading,
              showSkeletons: loading,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            enableColumnResizing
            enableRowSelection
            enableGrouping
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()

                  let id = row.original.ID

                  setLoadingOperation(true)

                  await api
                    .get('tvet/find/' + id)
                    .then((response) => {
                      setEditId(id)
                      // setIsEnableEdit(true)

                      setEditModalVisible(true)
                      form.setValues({
                        status: response.data.colAppStat,
                        app_no_year: response.data.colAppNoYear,
                        app_no_sem: response.data.colAppNoSem,
                        app_no_id: response.data.colAppNoID,
                        firstname: response.data.colFirstName,
                        lastname: response.data.colLastName,
                        middle_initial: response.data.colMI,
                        suffix: response.data.colSuffix,
                        address: response.data.colAddress,
                        birthdate: moment(response.data.colDOB).format('YYYY-MM-DD'),
                        age: response.data.colAge,
                        civil_status: response.data.colCivilStat,
                        sex: response.data.colGender,
                        contact_number: response.data.colContactNo,
                        ctc_number: response.data.colCTC,
                        email_address: response.data.colEmailAdd,
                        availment: response.data.colAvailment,
                        school: response.data.colSchool,
                        course: response.data.colCourse,
                        school_address: response.data.colSchoolAddress,
                        year_level: response.data.colYearLevel,
                        semester: response.data.colSem,
                        hour_number: response.data.colUnits,
                        school_year: response.data.colSY,
                        father_name: response.data.colFathersName,
                        father_occupation: response.data.colFatherOccu,
                        mother_name: response.data.colMothersName,
                        mother_occupation: response.data.colMotherOccu,
                      })
                    })
                    .catch((error) => {
                      toast.error('Error fetching data')
                      // console.error('Error fetching data:', error)
                    })
                    .finally(() => {
                      setLoadingOperation(false)
                    })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <EditSharp />
                </ListItemIcon>
                Edit
              </MenuItem>,
            ]}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <Box
                  className="d-none d-lg-flex"
                  sx={{
                    display: 'flex',
                    gap: '.2rem',
                    p: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <CButton
                    className="btn-info text-white"
                    onClick={() => handleExportTvetData(data)}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportTvetRows(table.getSelectedRowModel().rows)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                  </CButton>
                </Box>
              </>
            )}
          />
        </CCol>
      </CRow>

      <CModal
        fullscreen
        backdrop="static"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <CModalHeader onClose={() => setEditModalVisible(false)}>
          <CModalTitle>Edit Application</CModalTitle>
        </CModalHeader>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={editValidated}
          onSubmit={form.handleSubmit}
          style={{ position: 'relative' }}
        >
          <CModalBody>
            <CRow className="justify-content-between">
              <CCol md={7} sm={6} xs={6} lg={4} xl={4}>
                <CFormLabel>{RequiredField('Application Number ')}</CFormLabel>
                <CInputGroup className="mb-3 ">
                  <CFormInput
                    type="text"
                    name="app_no_year"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_year}
                    className="text-center"
                    placeholder="Year"
                    aria-label="Year"
                    required
                    readOnly
                  />
                  <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
                  <CFormInput
                    type="text"
                    name="app_no_sem"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_sem}
                    className="text-center "
                    placeholder="Semester"
                    aria-label="Sem"
                    required
                    readOnly
                  />
                  <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
                  <CFormInput
                    type="text"
                    name="app_no_id"
                    onChange={handleEditApplicationInputChange}
                    value={form.values.app_no_id}
                    className="text-center"
                    placeholder="App No"
                    aria-label="App No"
                    required
                    readOnly
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  aria-label="Status"
                  feedbackInvalid="Status is required."
                  label={RequiredField('Status')}
                  name="status"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.status}
                  required
                >
                  <option value="">Select</option>
                  {StatusType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Last Name is required."
                  label={RequiredField('Last Name')}
                  name="lastname"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.lastname}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackInvalid="First Name is required."
                  label={RequiredField('First Name')}
                  name="firstname"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.firstname}
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="M.I"
                  name="middle_initial"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.middle_initial}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="Suffix"
                  name="suffix"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.suffix}
                />
              </CCol>
            </CRow>
            <CRow className="my-2">
              <CCol md={12}>
                <CFormSelect
                  aria-label="Address"
                  feedbackInvalid="Address is required."
                  label={RequiredField('Address')}
                  name="address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.address}
                  required
                >
                  <option value="">Select</option>
                  {Address.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="my-2">
              <CCol md={3}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date of Birth is required."
                  label={RequiredField('Date of Birth')}
                  name="birthdate"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.birthdate}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Age is required."
                  label={RequiredField('Age')}
                  name="age"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.age}
                  required
                  readOnly
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Civil Status is required."
                  label={RequiredField('Civil Status')}
                  name="civil_status"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.civil_status}
                  required
                >
                  <option value="">Select</option>
                  {CivilStatus.map((civil_status, index) => (
                    <option key={index} value={civil_status}>
                      {civil_status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  type="text"
                  feedbackInvalid="Sex is required."
                  label={RequiredField('Sex')}
                  name="sex"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.sex}
                  required
                >
                  <option value="">Select</option>
                  {Sex.map((sex, index) => (
                    <option key={index} value={sex}>
                      {sex}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Contact #"
                  name="contact_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.contact_number}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  feedbackInvalid="CTC # is required."
                  label={RequiredField('CTC #')}
                  name="ctc_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.ctc_number}
                  required
                />
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Facebook/Others"
                  name="email_address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.email_address}
                />
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Availment is required."
                  label={RequiredField('Availment')}
                  name="availment"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.availment}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="School is required."
                  label={RequiredField('School')}
                  name="school"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school}
                  required
                >
                  <option value="">Select</option>
                  {school.map((school, index) => (
                    <option key={index} value={school.colSchoolName}>
                      {school.colSchoolName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Course is required."
                  label={RequiredField('Course')}
                  name="course"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.course}
                  required
                >
                  <option value="">Select</option>
                  {course.map((course, index) => (
                    <option key={index} value={course.colCourse}>
                      {course.colCourse}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="School Address"
                  name="school_address"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school_address}
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Year Level is required."
                  label={RequiredField('Year Level')}
                  name="year_level"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.year_level}
                  required
                >
                  <option value="">Select</option>
                  {YearLevel.map((year_level, index) => (
                    <option key={index} value={year_level}>
                      {year_level}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Semester is required."
                  label={RequiredField('Semester')}
                  name="semester"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.semester}
                  required
                >
                  <option value="">Select</option>
                  {Semester.map((semester, index) => (
                    <option key={index} value={semester}>
                      {semester}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormInput
                  type="number"
                  feedbackInvalid="No. of Hours is required."
                  label={RequiredField('No. of Hours')}
                  name="hour_number"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.hour_number}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="School Year is required."
                  label={RequiredField('School Year')}
                  name="school_year"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school_year}
                  required
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Father's Name"
                  name="father_name"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.father_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="father_occupation"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.father_occupation}
                />
              </CCol>
            </CRow>

            <CRow className="my-2">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Mother's Name"
                  name="mother_name"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.mother_name}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Occupation"
                  name="mother_occupation"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.mother_occupation}
                />
              </CCol>
            </CRow>
          </CModalBody>

          {loadingOperation && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Tvet
