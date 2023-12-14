import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {
  faCancel,
  faCheckSquare,
  faEye,
  faFileExcel,
  faFilter,
  faTimesRectangle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
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
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import moment from 'moment'
import {
  Address,
  CivilStatus,
  GradeLevel,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  api,
  calculateAge,
  decrypted,
  handleError,
  handleExportSeniorHighData,
  handleExportSeniorHighRows,
  requiredFieldNote,
  requiredField,
  seniorHighDefaultColumn,
  toSentenceCase,
  validationPrompt,
  ApprovedType,
  DefaultLoading,
} from 'src/components/Oroqscholarship'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [editValidated, setEditValidated] = useState(false)
  const [bulkApprovedValidated, setBulkApprovedValidated] = useState(false)
  const [strand, setStrand] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [modalBulkApproved, setModalBulkApprovedVisible] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [editId, setEditId] = useState('')
  const [table, setTable] = useState([])

  useEffect(() => {
    fetchData()
    fetchSchool()
    fetchStrand()
  }, [])

  const fetchSchool = () => {
    api
      .get('senior_high_school')
      .then((response) => {
        setSchool(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const fetchStrand = () => {
    api
      .get('strand')
      .then((response) => {
        setStrand(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const fetchData = () => {
    api
      .get('senior_high/get_by_status', {
        params: {
          status: 'pending',
        },
      })
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    approvedForm.setFieldValue(name, value)
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

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          ID: item.ID,
        }
      })
    validationPrompt(() => {
      setLoading(true)
      api
        .post('senior_high/bulk_status_update', {
          data: selectedRows,
          status: 'Archived',
        })

        .then((response) => {
          toast.success(response.data.message)
          fetchData()
          table.resetRowSelection()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleBulkDispprovedRows = async (table) => {
    const rows = table.getSelectedRowModel().rows

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          ID: item.ID,
        }
      })
    validationPrompt(() => {
      setLoading(true)
      api
        .post('senior_high/bulk_status_update', {
          data: selectedRows,
          status: 'Disapproved',
        })

        .then((response) => {
          toast.success(response.data.message)
          fetchData()
          table.resetRowSelection()
        })
        .catch((error) => {
          toast.error(handleError(error))
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const approvedForm = useFormik({
    initialValues: {
      status: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])
      if (areAllFieldsFilled) {
        validationPrompt(() => {
          setLoadingOperation(true)
          api
            .post('senior_high/bulk_status_update', {
              data: selectedRows,
              status: values.status,
            })
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              approvedForm.resetForm()
              setBulkApprovedValidated(false)
              setModalBulkApprovedVisible(false)
              table.resetRowSelection()
              // clear select rows
              setSelectedRows([])
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setLoadingOperation(false)
            })
        })
      } else {
        setBulkApprovedValidated(true)
      }
    },
  })

  const handleBulkApprovedRows = (table) => {
    const rows = table.getSelectedRowModel().rows

    // clear select rows
    setSelectedRows([])

    const selectedRows = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          ID: item.ID,
        }
      })

    setSelectedRows(selectedRows)
    setModalBulkApprovedVisible(true)
    setTable(table)
  }

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('senior_high/get_all_by_status', {
        params: {
          status: 'pending',
        },
      })
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
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
          .get('senior_high/filter_by_status', {
            params: {
              ...values,
              status: 'pending',
            },
          })
          .then((response) => {
            setData(decrypted(response.data))
            setEditValidated(false)
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
            setLoading(false)
          })
      } else {
        console.warn('Please fill in all required fields.')
        setEditValidated(true)
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
      strand: '',
      school_address: '',
      grade_level: '',
      semester: '',
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
          .put('senior_high/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            fetchData()
            setEditValidated(false)
            setEditModalVisible(false)
          })
          .catch((error) => {
            console.info(error)
            // toast.error(handleError(error))
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
            <requiredFieldNote />

            <CRow className="my-1">
              <CCol md={6}>
                <CFormSelect
                  feedbackInvalid="Semester is required."
                  label={requiredField('Semester')}
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
                  label={requiredField('School Year')}
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
            columns={seniorHighDefaultColumn}
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
                    .get('senior_high/find/' + id)
                    .then((response) => {
                      setEditId(id)

                      setEditModalVisible(true)
                      form.setValues({
                        status: response.data.AppStatus,
                        app_no_year: response.data.AppNoYear,
                        app_no_sem: response.data.AppNoSem,
                        app_no_id: response.data.AppNoID,
                        firstname: response.data.AppFirstName,
                        lastname: response.data.AppLastName,
                        middle_initial: response.data.AppMidIn,
                        suffix: response.data.AppSuffix,
                        address: response.data.AppAddress,
                        birthdate: moment(response.data.AppDOB).format('YYYY-MM-DD'),
                        age: response.data.AppAge,
                        civil_status: response.data.AppCivilStat,
                        sex: response.data.AppGender,
                        contact_number: response.data.AppContact,
                        ctc_number: response.data.AppCTC,
                        email_address: response.data.AppEmailAdd,
                        availment: response.data.AppAvailment,
                        school: response.data.AppSchool,
                        strand: response.data.AppCourse,
                        school_address: response.data.AppSchoolAddress,
                        grade_level: response.data.AppYear,
                        semester: response.data.AppSem,
                        school_year: response.data.AppSY,
                        father_name: response.data.AppFather,
                        father_occupation: response.data.AppFatherOccu,
                        mother_name: response.data.AppMother,
                        mother_occupation: response.data.AppMotherOccu,
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
              <MenuItem
                key={1}
                onClick={() => {
                  closeMenu()

                  let id = row.original.ID

                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      validationPrompt(() => {
                        setLoading(true)
                        api
                          .put('senior_high/update_status/' + id, { status: 'Archived' })
                          .then((response) => {
                            fetchData()
                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            toast.error(handleError(error))
                          })
                          .finally(() => {
                            setLoading(false)
                          })
                      })
                    }
                  })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                Delete
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
                    onClick={() => handleExportSeniorHighData(data)}
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportSeniorHighRows(table.getSelectedRowModel().rows)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    color="danger"
                    onClick={() => handleDeleteRows(table)}
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete Selected Rows
                  </CButton>
                  <CButton
                    color="primary"
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleBulkApprovedRows(table)}
                  >
                    <FontAwesomeIcon icon={faCheckSquare} /> Bulk Approved
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    className="  text-white"
                    color="danger"
                    onClick={() => handleBulkDispprovedRows(table)}
                  >
                    <FontAwesomeIcon icon={faTimesRectangle} /> Bulk Disapproved
                  </CButton>
                </Box>
              </>
            )}
          />
        </CCol>
      </CRow>

      {loading && <DefaultLoading />}

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalBulkApproved}
        onClose={() => setModalBulkApprovedVisible(false)}
      >
        <CModalHeader onClose={() => setModalBulkApprovedVisible(false)}>
          <CModalTitle> Bulk Approved </CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={bulkApprovedValidated}
          onSubmit={approvedForm.handleSubmit}
        >
          <CModalBody>
            <requiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Status is required."
                  label={requiredField('Status')}
                  name="status"
                  onChange={handleInputChange}
                  value={approvedForm.values.status}
                  required
                >
                  <option value="">Select</option>
                  {ApprovedType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CModalBody>

          {loadingOperation && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalBulkApprovedVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

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
                <CFormLabel>{requiredField('Application Number ')}</CFormLabel>
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
                  label={requiredField('Status')}
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
                  label={requiredField('Last Name')}
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
                  label={requiredField('First Name')}
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
                  label={requiredField('Address')}
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
                  label={requiredField('Date of Birth')}
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
                  label={requiredField('Age')}
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
                  label={requiredField('Civil Status')}
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
                  label={requiredField('Sex')}
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
                  label={requiredField('CTC #')}
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
                  label={requiredField('Availment')}
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
                  label={requiredField('School')}
                  name="school"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.school}
                  required
                >
                  <option value="">Select</option>
                  {school.map((school, index) => (
                    <option key={index} value={school.SchoolName}>
                      {school.SchoolName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  feedbackInvalid="Strand is required."
                  label={requiredField('Strand')}
                  name="strand"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.strand}
                  required
                >
                  <option value="">Select</option>
                  {strand.map((strand, index) => (
                    <option key={index} value={strand.Strand}>
                      {strand.Strand}
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
              <CCol md={4}>
                <CFormSelect
                  feedbackInvalid="Grade Level is required."
                  label={requiredField('Grade Level')}
                  name="grade_level"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.grade_level}
                  required
                >
                  <option value="">Select</option>
                  {GradeLevel.map((grade_level, index) => (
                    <option key={index} value={grade_level}>
                      {grade_level}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  feedbackInvalid="Semester is required."
                  label={requiredField('Semester')}
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

              <CCol md={4}>
                <CFormSelect
                  feedbackInvalid="School Year is required."
                  label={requiredField('School Year')}
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

export default SeniorHigh
