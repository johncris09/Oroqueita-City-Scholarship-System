import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  CFormSelect,
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
import { ApprovedType, SchoolYear, Semester } from 'src/components/DefaultValue'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

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
        toast.error(HandleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const approvedForm = useFormik({
    initialValues: {
      status: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoadingOperation(true)
        await api
          .post('senior_high/bulk_approved', {
            data: selectedRows,
            status: values.status,
          })
          .then((response) => {
            console.info(response.data)

            toast.warning('Still Working...')

            approvedForm.resetForm()
            setValidated(false)
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
          })
      } else {
        setValidated(true)
      }
    },
  })

  const column = [
    {
      accessorKey: 'AppNoID',
      header: 'Application #',
      accessorFn: (row) => `${row.AppNoYear}-${row.AppNoSem}-${row.AppNoID}`,
      //custom conditional format and styling
      Cell: ({ cell }) => (
        <Box
          fontSize={12}
          component="span"
          sx={(theme) => ({
            backgroundColor: '#757575',
            borderRadius: '0.25rem',
            color: '#fff',
            maxWidth: '20ch',
            p: '0.05rem',
          })}
        >
          {cell.getValue()}
        </Box>
      ),
    },
    {
      accessorKey: 'AppFirstName',
      header: 'First Name',
    },
    {
      accessorKey: 'AppLastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'AppMidIn',
      header: 'Middle Name',
    },
    {
      accessorKey: 'AppContact',
      header: 'Contact #',
    },
    {
      accessorKey: 'AppAddress',
      header: 'Address',
    },
    {
      accessorKey: 'AppGender',
      header: 'Gender',
    },
    {
      accessorKey: 'AppSchool',
      header: 'School',
    },
    {
      accessorKey: 'AppCourse',
      header: 'Strand',
    },
    {
      accessorKey: 'AppSY',
      header: 'School Year',
    },
    {
      accessorKey: 'AppSem',
      header: 'Semester',
    },
    {
      accessorKey: 'AppStatus',
      header: 'Application Status',
    },
    {
      accessorKey: 'AppAvailment',
      header: 'Availment',
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    approvedForm.setFieldValue(name, value)
    filterForm.setFieldValue(name, value)
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          'Application #': `${item.AppNoYear}-${item.AppNoSem}-${item.AppNoID}`,
          'First Name': item.AppFirstName,
          'Last Name': item.AppLastName,
          'Middle Name': item.AppMidIn,
          Address: item.AppAddress,
          'Contact #': item.AppContact,
          Gender: item.AppGender,
          School: item.AppSchool,
          Strand: item.AppCourse,
          'School Year': item.AppSY,
          Semester: item.AppSem,
          'Application Status': item.AppStatus,
          Availment: item.AppAvailment,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows
    console.info(rows)
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
    setLoading(true)
    await api
      .post('senior_high/bulk_disapproved', { data: selectedRows })
      .then((response) => {
        console.info(response.data)
        toast.warning('Still Working...')
      })
      .catch((error) => {
        toast.error(HandleError(error))
      })
      .finally(() => {
        setLoading(false)
      })
  }

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
    setModalVisible(true)
  }

  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        'Application #': `${item.AppNoYear}-${item.AppNoSem}-${item.AppNoID}`,
        'First Name': item.AppFirstName,
        'Last Name': item.AppLastName,
        'Middle Name': item.AppMidIn,
        Address: item.AppAddress,
        'Contact #': item.AppContact,
        Gender: item.AppGender,
        School: item.AppSchool,
        Strand: item.AppCourse,
        'School Year': item.AppSY,
        Semester: item.AppSem,
        'Application Status': item.AppStatus,
        Availment: item.AppAvailment,
      }
    })
    csvExporter.generateCsv(exportedData)
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
          .get('senior_high/filter_by_status', {
            params: {
              ...values,
              status: 'pending',
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
            columns={column}
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
            // enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()

                  let id = row.original.ID
                  console.info(id)
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
                  console.info(id)
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
                  {/* <CButton
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
                  </CButton> */}
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
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> Bulk Approved </CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
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
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default SeniorHigh
