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
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import api from 'src/components/Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { ToastContainer, toast } from 'react-toastify'
import { ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
import { DefaultLoading } from 'src/components/Loading'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'

const User = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('user')
      .then((response) => {
        // console.info(response)
        // console.info(decrypted(response.data))
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(HandleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const form = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      middle_initial: '',
      username: '',
      password: '',
      role_type: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = ['password', 'middle_initial']

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        // Check if the field is non-optional and not empty
        return nonOptionalFields.includes(key) || !!values[key]
      })
      if (allNonOptionalFieldsNotEmpty) {
        // setOperationLoading(true)
        if (!isEnableEdit) {
          // add new data
          await api
            .post('user/insert', values)
            .then((response) => {
              toast.success(response.data.message)
              form.resetForm()
              setValidated(false)
              fetchData()
            })
            .catch((error) => {
              toast.error(HandleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
            })
        } else {
          // update
          setFetchDataLoading(true)
          await api
            .put('user/update/' + editId, values)
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              setValidated(false)
              setModalFormVisible(false)
            })
            .catch((error) => {
              console.info(error)
              // toast.error(HandleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
              setFetchDataLoading(false)
            })
        }
      } else {
        toast.warning('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const updatePasswordForm = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setOperationLoading(true)
        setFetchDataLoading(true)
        if (isEnableEdit) {
          // update password
          await api
            .put('user/change_password/' + editId, values)
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              setPasswordValidated(false)
              setModalChangePasswordFormVisible(false)
            })
            .catch((error) => {
              toast.error(HandleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
              setFetchDataLoading(false)
            })
        }
      } else {
        toast.warning('Please fill in all required fields.')
        setPasswordValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text' && name !== 'username') {
      const titleCaseValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      form.setFieldValue(name, titleCaseValue)
    } else {
      form.setFieldValue(name, value)
    }
  }

  const handlePasswordInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    updatePasswordForm.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'FirstName',
      header: 'First Name',
    },

    {
      accessorKey: 'MidIn',
      header: 'M.I.',
    },
    {
      accessorKey: 'LastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'UserName',
      header: 'Username',
    },
    {
      accessorKey: 'Role',
      header: 'Role',
    },
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>
          User
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalFormVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add User
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
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
            data={data}
            enableRowVirtualization
            enableColumnVirtualization
            enableGrouping
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()
                  let id = row.original.ID
                  setIsEnableEdit(true)
                  setEditId(id)
                  setFetchDataLoading(true)
                  setOperationLoading(true)
                  await api
                    .get('user/find/' + id)
                    .then((response) => {
                      const res = decrypted(response.data)
                      console.info(res)
                      form.setValues({
                        first_name: res.FirstName,
                        middle_initial: res.MidIn,
                        last_name: res.LastName,
                        username: res.UserName,
                        role_type: res.Role,
                      })
                      setModalFormVisible(true)
                    })
                    .catch((error) => {
                      toast.error('Error fetching data')
                    })
                    .finally(() => {
                      setOperationLoading(false)
                      setFetchDataLoading(false)
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
                        confirmButtonText: 'OK',
                      }).then(async function (result) {
                        if (result.isConfirmed) {
                          if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
                            let id = row.original.ID
                            setFetchDataLoading(true)
                            api
                              .delete('user/delete/' + id)
                              .then((response) => {
                                fetchData()
                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                toast.error(HandleError(error))
                              })
                              .finally(() => {
                                setFetchDataLoading(false)
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
                Delete
              </MenuItem>,
              <MenuItem
                key={2}
                onClick={async () => {
                  closeMenu()
                  let id = row.original.ID

                  setEditId(id)
                  setModalChangePasswordFormVisible(true)
                  setIsEnableEdit(true)
                  updatePasswordForm.setValues({
                    password: '',
                  })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <Key />
                </ListItemIcon>
                Change Password
              </MenuItem>,
            ]}
          />

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalFormVisible}
        onClose={() => setModalFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{isEnableEdit ? 'Edit User' : 'Add New User'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            noValidate
            validated={validated}
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="First Name is required."
                label={RequiredField('First Name')}
                name="first_name"
                onChange={handleInputChange}
                value={form.values.first_name}
                required
                placeholder="First Name"
              />
              <CFormInput
                type="text"
                label="Middle Initial"
                name="middle_initial"
                onChange={handleInputChange}
                value={form.values.middle_initial}
                placeholder="Middle Initial"
              />
              <CFormInput
                type="text"
                feedbackInvalid="Last Name is required."
                label={RequiredField('Last Name')}
                name="last_name"
                onChange={handleInputChange}
                value={form.values.last_name}
                required
                placeholder="Last Name"
              />
              <CFormInput
                type="text"
                feedbackInvalid="Username is required."
                label={RequiredField('Username')}
                name="username"
                onChange={handleInputChange}
                value={form.values.username}
                required
                placeholder="Username"
              />
              {!isEnableEdit && (
                <CFormInput
                  type="password"
                  feedbackInvalid="Password is required."
                  label={RequiredField('Password')}
                  name="password"
                  onChange={handleInputChange}
                  value={form.values.password}
                  required
                  placeholder="Password"
                />
              )}

              <CFormSelect
                aria-label="Role Type"
                feedbackInvalid="Role Type is required."
                label={RequiredField('Role Type')}
                name="role_type"
                onChange={handleInputChange}
                value={form.values.role_type}
                required
              >
                <option value="">Select</option>
                <option value="Administrator">Administrator</option>
                <option value="Encoder">Encoder</option>
              </CFormSelect>
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit form'}
              </CButton>
            </CCol>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        visible={modalChangePasswordFormVisible}
        onClose={() => setModalChangePasswordFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            noValidate
            validated={passwordValidated}
            onSubmit={updatePasswordForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CCol md={12}>
              <CFormInput
                type="password"
                feedbackInvalid="Password is required."
                label={RequiredField('Password')}
                name="password"
                onChange={handlePasswordInputChange}
                value={updatePasswordForm.values.password}
                required
              />
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Change Password
              </CButton>
            </CCol>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
