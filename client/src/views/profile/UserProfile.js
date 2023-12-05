import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { CButton, CCol, CForm, CFormInput, CFormSelect } from '@coreui/react'
import api from 'src/components/Api'
import { useFormik } from 'formik'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { ToastContainer, toast } from 'react-toastify'
import { decrypted } from 'src/components/Encrypt'
import { jwtDecode } from 'jwt-decode'
import { DefaultLoading } from 'src/components/Loading'

const UserProfile = () => {
  const [validated, setValidated] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [editId, setEditId] = useState('')

  const form = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      middle_initial: '',
      username: '',
      role_type: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = ['middle_initial']

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        // Check if the field is non-optional and not empty
        return nonOptionalFields.includes(key) || !!values[key]
      })

      if (allNonOptionalFieldsNotEmpty) {
        await api
          .put('user/update/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            setValidated(false)
          })
          .catch((error) => {
            console.info(error)
            // toast.error(HandleError(error))
          })
          .finally(() => {
            setOperationLoading(false)
          })
      } else {
        toast.warning('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  useEffect(() => {
    const userInfo = jwtDecode(localStorage.getItem('oroqScholarshipToken'))
    setEditId(userInfo.id)
    api
      .get('user/find/' + userInfo.id)
      .then((response) => {
        const res = decrypted(response.data)
        form.setValues({
          first_name: res.FirstName,
          middle_initial: res.MidIn,
          last_name: res.LastName,
          username: res.UserName,
          role_type: res.Role,
        })
      })
      .catch((error) => {
        toast.error('Error fetching data')
      })
  }, [])

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

  return (
    <>
      <ToastContainer />
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
            <option value="Encorder">Encorder</option>
          </CFormSelect>
        </CCol>

        <hr />
        <CCol xs={12}>
          <CButton color="primary" type="submit" className="float-end">
            Update Profile
          </CButton>
        </CCol>
      </CForm>
      {operationLoading && <DefaultLoading />}
    </>
  )
}

export default UserProfile