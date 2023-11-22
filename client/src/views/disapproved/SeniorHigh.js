import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFileExcel, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CButton, CCol, CForm, CFormSelect, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import api from 'src/components/Api'
import { DefaultLoading } from 'src/components/Loading'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { SchoolYear, Semester } from 'src/components/DefaultValue'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { decrypted } from 'src/components/Encrypt'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('senior_high/disapproved')
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            toast.error('Error fetching data!')
            break
          case 'ERR_NETWORK':
            toast.error('Please check you internet connect and try again!')
            break
          default:
            toast.error('An error occurred!')
            console.error('An error occurred:', error)
            break
        }
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

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
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
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
        }
      })

    csvExporter.generateCsv(exportedData)
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
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  const handleViewAllData = () => {
    setLoading(true)
    api
      .get('senior_high/all_disapproved')
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            toast.error('Error fetching data!')
            break
          case 'ERR_NETWORK':
            toast.error('Please check you internet connect and try again!')
            break
          default:
            toast.error('An error occurred!')
            console.error('An error occurred:', error)
            break
        }
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
          .post('senior_high/filter_disapproved', values)
          .then((response) => {
            setData(decrypted(response.data))
            setValidated(false)
          })
          .catch((error) => {
            toast.error('Error fetching data')
            console.error('Error fetching data:', error)
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
                </Box>
              </>
            )}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default SeniorHigh
