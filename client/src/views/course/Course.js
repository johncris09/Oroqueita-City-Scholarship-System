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
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'

const Course = () => {
  const [course, setCourse] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchCourseLoading, setFetchCourseLoading] = useState(true)
  const [courseOperationLoading, setCourseOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchCourse()
  }, [])

  const courseColumn = [
    {
      accessorKey: 'colCourse',
      header: 'Course',
    },
    {
      accessorKey: 'colManager',
      header: 'Manager',
    },
  ]

  const fetchCourse = () => {
    api
      .get('course/get_all')
      .then((response) => {
        setCourse(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(HandleError(error))
      })
      .finally(() => {
        setFetchCourseLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      course: '',
      manager: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setCourseOperationLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('course/insert', values)
              .then((response) => {
                toast.success(response.data.message)
                fetchCourse(0)
                formik.resetForm()
                setValidated(false)
              })
              .catch((error) => {
                toast.error(HandleError(error))
              })
              .finally(() => {
                setCourseOperationLoading(false)
              })
          : // update data
            await api
              .put('course/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchCourse()
                setValidated(false)
                setModalVisible(false)
              })
              .catch((error) => {
                toast.error(HandleError(error))
              })
              .finally(() => {
                setCourseOperationLoading(false)
              })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: courseColumn.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          Course: item.colCourse,
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
        setFetchCourseLoading(true)
        const selectedRows = rows
          .map((row) => row.original)
          .map((item) => {
            return {
              ID: item.ID,
            }
          })
        api
          .delete('course/bulk_delete', { data: selectedRows })
          .then((response) => {
            fetchCourse()

            toast.success(response.data.message)
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setFetchCourseLoading(false)

            table.resetRowSelection()
          })
      }
    })
  }

  const handleExportData = () => {
    const exportedData = course.map((item) => {
      return {
        Course: item.colCourse,
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
          Course
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
              <FontAwesomeIcon icon={faPlus} /> Add Course
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={courseColumn}
            state={{
              isLoading: fetchCourseLoading,
              isSaving: fetchCourseLoading,
              showLoadingOverlay: fetchCourseLoading,
              showProgressBars: fetchCourseLoading,
              showSkeletons: fetchCourseLoading,
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
            data={course}
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
                  console.info(id)
                  setEditId(id)
                  formik.setValues({
                    course: row.original.colCourse,
                    manager: row.original.colManager,
                  })

                  setIsEnableEdit(true)

                  setModalVisible(true)
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

                      setFetchCourseLoading(true)

                      api
                        .delete('course/delete/' + id)
                        .then((response) => {
                          fetchCourse()

                          toast.success(response.data.message)
                        })
                        .catch((error) => {
                          toast.error(HandleError(error))
                        })
                        .finally(() => {
                          setFetchCourseLoading(false)
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

          {fetchCourseLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? 'Edit Course' : 'Add New Course'}</CModalTitle>
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
                  feedbackInvalid="Course is required."
                  label={RequiredField('Course')}
                  name="course"
                  onChange={handleInputChange}
                  value={formik.values.course}
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

          {courseOperationLoading && <DefaultLoading />}

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

export default Course
