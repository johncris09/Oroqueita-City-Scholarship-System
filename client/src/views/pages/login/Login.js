import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo-sm.png'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import api from 'src/components/Api'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading } from 'src/components/Loading'
import HandleError from 'src/components/HandleError'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token') // Assuming the token is stored in local storage
    if (token) {
      // If the token is set, navigate to the dashboard
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoading(true)
        await api
          .post('login', values)
          .then((response) => {
            if (response.data.status) {
              toast.success(response.data.message)
              localStorage.setItem('token', response.data.token)

              navigate('/dashboard', { replace: true })
            } else {
              toast.error(response.data.message)
            }
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoading(false)
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

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={12} lg={6} xl={6}>
            <CCardGroup>
              <CCard className="p-4" style={{ position: 'relative' }}>
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>

                  <CForm
                    className="row g-3 needs-validation"
                    onSubmit={formik.handleSubmit}
                    // noValidate
                    validated={validated}
                  >
                    <h3 className="text-center">
                      Oroquieta City <br /> Scholarship System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      className="text-center py-2"
                      type="text"
                      placeholder="Username"
                      // feedbackInvalid="Username is required."
                      name="username"
                      onChange={handleInputChange}
                      value={formik.values.username}
                      required
                    />
                    <CFormInput
                      className="text-center py-2"
                      type="password"
                      placeholder="Password"
                      // feedbackInvalid="Password is required."
                      name="password"
                      onChange={handleInputChange}
                      value={formik.values.password}
                      required
                    />
                    <CButton type="submit" color="primary">
                      Login
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              {loading && <DefaultLoading />}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
