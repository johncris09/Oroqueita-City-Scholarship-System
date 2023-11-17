import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useFormik } from 'formik'
import React, { useState, useEffect, useRef } from 'react'

import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'

const SeniorHigh = () => {
  const toastId = React.useRef(null)

  const notify = () => {
    toastId.current = toast('Please Wait!', {
      position: 'top-right',
      isLoading: true,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }

  const update = () => {
    toast.update(toastId.current, {
      render: 'Success',
      isLoading: false,
      type: toast.TYPE.SUCCESS,
      autoClose: 3000,
      closeButton: null, // The closeButton defined on ToastContainer will be used
    })
  }

  const [validated, setValidated] = useState(false)

  const onSubmit = async (values) => {
    console.info(values)
  }

  const formik = useFormik({
    initialValues: {
      // firstname: 'richly',
      firstname: '',
      // lastname: 'richly',
    },
    onSubmit,
  })

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  })

  return (
    <>
      {/* <ToastContainer />
      <div>
        <button onClick={notify}>Notify</button>
        <button onClick={update}>Update</button>
      </div> */}
      <CContainer>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
          validationSchema={SignupSchema}
        >
          <CCol md={4}>
            <CFormInput
              type="text"
              placeholder="First Name"
              name="firstname"
              onChange={formik.handleChange}
              value={formik.values.firstname}
              required
              label="First name"
            />
          </CCol>
          {/* <CCol md={4}>
            <CFormInput
              type="text"
              defaultValue="Otto"
              feedbackValid="Looks good!"
              id="validationCustom02"
              label="First name"
              required
            />
          </CCol> */}
          {/* <CCol md={4}>
            <CFormLabel htmlFor="validationCustomUsername">Username</CFormLabel>
            <CInputGroup className="has-validation">
              <CInputGroupText>@</CInputGroupText>
              <CFormInput
                type="text"
                aria-describedby="inputGroupPrependFeedback"
                feedbackValid="Please choose a username."
                id="validationCustomUsername"
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid city."
              id="validationCustom03"
              label="City"
              required
            />
          </CCol>
          <CCol md={3}>
            <CFormSelect
              aria-describedby="validationCustom04Feedback"
              feedbackInvalid="Please select a valid state."
              id="validationCustom04"
              label="State"
              required
            >
              <option disabled>Choose...</option>
              <option>...</option>
            </CFormSelect>
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="text"
              aria-describedby="validationCustom05Feedback"
              feedbackInvalid="Please provide a valid zip."
              id="validationCustom05"
              label="Zip"
              required
            />
          </CCol>
          <CCol xs={12}>
            <CFormCheck
              type="checkbox"
              id="invalidCheck"
              label="Agree to terms and conditions"
              required
            />
            <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
          </CCol> */}
          <CCol xs={12}>
            <CButton color="primary" type="submit">
              Submit form
            </CButton>
          </CCol>
        </CForm>
      </CContainer>
    </>
  )
}

export default SeniorHigh
