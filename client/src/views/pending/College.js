import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {
  faCancel,
  faCheckSquare,
  faEye,
  faFileExcel,
  faFilter,
  faRotateBack,
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
import api from 'src/components/Api'
import { DefaultLoading } from 'src/components/Loading'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  Address,
  ApprovedType,
  CivilStatus,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
  collegeDefaultColumn,
} from 'src/components/DefaultValue'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'

const College = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [editValidated, setEditValidated] = useState(false)
  const [bulkApprovedValidated, setBulkApprovedValidated] = useState(false)
  const [course, setCourse] = useState([])
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
      .get('college/get_by_status', {
        params: {
          status: 'pending',
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
    approvedForm.setFieldValue(name, value)
    filterForm.setFieldValue(name, value)
  }

  const handleEditApplicationInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text') {
      const titleCaseValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      form.setFieldValue(name, titleCaseValue)
    } else {
      form.setFieldValue(name, value)
    }

    if (type === 'date') {
      const birthDate = new Date(value)
      const currentDate = new Date()

      const ageInMilliseconds = currentDate - birthDate
      const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))

      form.setFieldValue('age', ageInYears)
    }
  }
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: collegeDefaultColumn.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
          'First Name': item.colFirstName,
          'Last Name': item.colLastName,
          'Middle Name': item.colMI,
          Address: item.colAddress,
          'Contact #': item.colContactNo,
          Gender: item.colGender,
          School: item.colSchool,
          Strand: item.colCourse,
          'School Year': item.colSY,
          Semester: item.colSem,
          'Application Status': item.colAppStat,
          Availment: item.colAvailment,
        }
      })

    csvExporter.generateCsv(exportedData)
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
        Swal.fire({
          title: 'Please enter the secret key to proceed.',
          input: 'password',
          icon: 'info',
          customClass: {
            validationMessage: 'my-validation-message',
            alignment: 'text-center',
          },
          preConfirm: (value) => {
            if (!value) {
              Swal.showValidationMessage('This field is required')
            }
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
        }).then(async function (result) {
          if (result.isConfirmed) {
            if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
              setLoading(true)
              await api
                .post('college/bulk_status_update', {
                  data: selectedRows,
                  status: 'Archived',
                })

                .then((response) => {
                  console.info(response.data)
                  toast.success(response.data.message)
                  fetchData()
                  table.resetRowSelection()
                })
                .catch((error) => {
                  toast.error(HandleError(error))
                })
                .finally(() => {
                  setLoading(false)
                })
            } else {
              Swal.fire({
                title: 'Error!',
                html: 'Invalid Secrey Key',
                icon: 'error',
              })
            }
          }
        })
      }
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

    Swal.fire({
      title: 'Please enter the secret key to proceed.',
      input: 'password',
      icon: 'info',
      customClass: {
        validationMessage: 'my-validation-message',
        alignment: 'text-center',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('This field is required')
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then(async function (result) {
      if (result.isConfirmed) {
        if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
          setLoading(true)
          await api
            .post('college/bulk_status_update', {
              data: selectedRows,
              status: 'Disapproved',
            })

            .then((response) => {
              console.info(response.data)
              toast.success(response.data.message)
              fetchData()
              table.resetRowSelection()
            })
            .catch((error) => {
              toast.error(HandleError(error))
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Invalid Secrey Key',
            icon: 'error',
          })
        }
      }
    })
  }

  const approvedForm = useFormik({
    initialValues: {
      status: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])
      if (areAllFieldsFilled) {
        Swal.fire({
          title: 'Please enter the secret key to proceed.',
          input: 'password',
          icon: 'info',
          customClass: {
            validationMessage: 'my-validation-message',
            alignment: 'text-center',
          },
          preConfirm: (value) => {
            if (!value) {
              Swal.showValidationMessage('This field is required')
            }
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
        }).then(async function (result) {
          if (result.isConfirmed) {
            if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
              setLoadingOperation(true)
              await api
                .post('college/bulk_status_update', {
                  data: selectedRows,
                  status: values.status,
                })
                .then((response) => {
                  console.info(response.data)
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
                  toast.error(HandleError(error))
                })
                .finally(() => {
                  setLoadingOperation(false)
                })
            } else {
              Swal.fire({
                title: 'Error!',
                html: 'Invalid Secrey Key',
                icon: 'error',
              })
            }
          }
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

  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
        'First Name': item.colFirstName,
        'Last Name': item.colLastName,
        'Middle Name': item.colMI,
        Address: item.colAddress,
        'Contact #': item.colContactNo,
        Gender: item.colGender,
        School: item.colSchool,
        Strand: item.colCourse,
        'School Year': item.colSY,
        Semester: item.colSem,
        'Application Status': item.colAppStat,
        Availment: item.colAvailment,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('college/get_all_by_status', {
        params: {
          status: 'pending',
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
          .get('college/filter_by_status', {
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
            toast.error(HandleError(error))
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
      course: '',
      school_address: '',
      year_level: '',
      semester: '',
      units: '',
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
          .put('college/update/' + editId, values)
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
            columns={collegeDefaultColumn}
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
                    .get('college/find/' + id)
                    .then((response) => {
                      console.info(response.data)
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
                        birthdate: response.data.colDOB,
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
                        units: response.data.colUnits,
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
                      Swal.fire({
                        title: 'Please enter the secret key to proceed.',
                        input: 'password',
                        icon: 'info',
                        customClass: {
                          validationMessage: 'my-validation-message',
                          alignment: 'text-center',
                        },
                        preConfirm: (value) => {
                          if (!value) {
                            Swal.showValidationMessage('This field is required')
                          }
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Ok',
                      }).then(async function (result) {
                        if (result.isConfirmed) {
                          if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
                            setLoading(true)
                            api
                              .put('college/update_status/' + id, { status: 'Archived' })
                              .then((response) => {
                                fetchData()
                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                toast.error(HandleError(error))
                              })
                              .finally(() => {
                                setLoading(false)
                              })
                          } else {
                            Swal.fire({
                              title: 'Error!',
                              html: 'Invalid Secrey Key',
                              icon: 'error',
                            })
                          }
                        }
                      })
                    }
                  })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                Delete (Archived)
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
                  <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    size="sm"
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
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
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Status is required."
                  label={RequiredField('Status')}
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
                  feedbackInvalid="Units is required."
                  label={RequiredField('Units')}
                  name="units"
                  onChange={handleEditApplicationInputChange}
                  value={form.values.units}
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

export default College
