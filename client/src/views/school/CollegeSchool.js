import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import api from 'src/components/Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { Manager } from 'src/components/DefaultValue'
import { ToastContainer, toast } from 'react-toastify'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { DefaultLoading } from 'src/components/Loading'
import { ExportToCsv } from 'export-to-csv'

const CollegeSchool = () => {
  const [collegeSchool, setCollegeSchool] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchCollegeSchoolLoading, setFetchCollegeSchoolLoading] = useState(true)
  const [collegeSchoolOperationLoading, setCollegeSchoolOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchCollegeSchool()
  }, [])

  const collegeSchoolColumn = [
    {
      accessorKey: 'colSchoolName',
      header: 'School Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'colManager',
      header: 'Manager',
    },
  ]

  const fetchCollegeSchool = () => {
    api
      .get('college_school/get_all')
      .then((response) => {
        setCollegeSchool(response.data)
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
        setFetchCollegeSchoolLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      school_name: '',
      manager: '',
      address: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setCollegeSchoolOperationLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('college_school/insert', values)
              .then((response) => {
                toast.success(response.data.message)
                fetchCollegeSchool(0)
                formik.resetForm()
                setValidated(false)
              })
              .catch((error) => {
                toast.error('Error fetching data')
                console.error('Error fetching data:', error)
              })
              .finally(() => {
                setCollegeSchoolOperationLoading(false)
              })
          : // update data
            await api
              .put('college_school/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchCollegeSchool()
                setValidated(false)
                setModalVisible(false)
              })
              .catch((error) => {
                toast.error('Error fetching data')
                console.error('Error fetching data:', error)
              })
              .finally(() => {
                setCollegeSchoolOperationLoading(false)
              })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'text') {
      const titleCaseValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      formik.handleChange(e)
      formik.setFieldValue(name, titleCaseValue)
    } else {
      formik.setFieldValue(name, value)
    }
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: collegeSchoolColumn.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          'School Name': item.colSchoolName,
          Address: item.address,
          Manager: item.colManager,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

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
        setFetchCollegeSchoolLoading(true)
        const selectedRows = rows
          .map((row) => row.original)
          .map((item) => {
            return {
              ID: item.ID,
            }
          })
        api
          .delete('college_school/bulk_delete', { data: selectedRows })
          .then((response) => {
            console.info(response.data)
            fetchCollegeSchool()

            toast.success(response.data.message)
          })
          .catch((error) => {
            toast.error('Error fetching data')
            console.error('Error fetching data:', error)
          })
          .finally(() => {
            setFetchCollegeSchoolLoading(false)

            table.resetRowSelection()
          })
      }
    })
  }

  const handleExportData = () => {
    const exportedData = collegeSchool.map((item) => {
      return {
        'School Name': item.colSchoolName,
        Address: item.address,
        Manager: item.colManager,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          College School
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                formik.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add College School
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={collegeSchoolColumn}
            state={{
              isLoading: fetchCollegeSchoolLoading,
              isSaving: fetchCollegeSchoolLoading,
              showLoadingOverlay: fetchCollegeSchoolLoading,
              showProgressBars: fetchCollegeSchoolLoading,
              showSkeletons: fetchCollegeSchoolLoading,
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
            data={collegeSchool}
            enableRowSelection
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
                  setFetchCollegeSchoolLoading(true)

                  api
                    .get('college_school/find/' + id)
                    .then((response) => {
                      setEditId(id)
                      setIsEnableEdit(true)

                      setModalVisible(true)
                      formik.setValues({
                        school_name: response.data.colSchoolName,
                        address: response.data.address,
                        manager: response.data.colManager,
                      })
                    })
                    .catch((error) => {
                      toast.error('Error fetching data')
                      console.error('Error fetching data:', error)
                    })
                    .finally(() => {
                      setFetchCollegeSchoolLoading(false)
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
                      let id = row.original.ID

                      setFetchCollegeSchoolLoading(true)

                      api
                        .delete('college_school/delete/' + id)
                        .then((response) => {
                          fetchCollegeSchool()

                          toast.success(response.data.message)
                        })
                        .catch((error) => {
                          console.error('Error fetching data:', error)
                        })
                        .finally(() => {
                          setFetchCollegeSchoolLoading(false)
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
                  className="  text-white"
                  color="danger"
                  onClick={() =>
                    // handleDeleteRows(table.getSelectedRowModel().rows)
                    handleDeleteRows(table)
                  }
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Delete Selected Rows
                </CButton>
              </Box>
            )}
          />

          {fetchCollegeSchoolLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>
            {isEnableEdit ? 'Edit College School' : 'Add New College School'}
          </CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="School Name is required."
                  label={RequiredField('School Name')}
                  name="school_name"
                  onChange={handleInputChange}
                  value={formik.values.school_name}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Address is required."
                  label={RequiredField('Address')}
                  name="address"
                  onChange={handleInputChange}
                  value={formik.values.address}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Manager is required."
                  label={RequiredField('Manager')}
                  name="manager"
                  onChange={handleInputChange}
                  value={formik.values.manager}
                  required
                >
                  <option value="">Select</option>
                  {Manager.map((manager, index) => (
                    <option key={index} value={manager}>
                      {manager}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CModalBody>

          {collegeSchoolOperationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default CollegeSchool
