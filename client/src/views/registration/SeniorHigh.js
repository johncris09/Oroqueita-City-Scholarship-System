import React, { useEffect, useState } from 'react'
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
  CRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import {
  Address,
  CivilStatus,
  GradeLevel,
  SchoolYear,
  Semester,
  Sex,
} from 'src/components/DefaultValue'
import api from 'src/components/Api'
import { decrypted } from 'src/components/Encrypt'
import { DefaultLoading } from 'src/components/Loading'
import * as Yup from 'yup'
import HandleError from 'src/components/HandleError'
const SeniorHigh = () => {
  const [validated, setValidated] = useState(false)
  const [school, setSchool] = useState([])
  const [strand, setStrand] = useState([])
  const [shsAppNo, setShsAppNo] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)

  useEffect(() => {
    fetchSchool()
    fetchStrand()
    fetchappno()
  }, [school])

  const fetchappno = async () => {
    await api
      .get('system_sequence/shs_appno')
      .then((response) => {
        formik.setFieldValue('app_no_year', response.data.seq_year)
        formik.setFieldValue('app_no_sem', response.data.seq_sem)
        formik.setFieldValue('app_no_id', parseInt(response.data.seq_appno) + 1)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
    // .finally(() => {
    //   setLoading(false)
    // })
  }
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

  const formik = useFormik({
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
          .post('senior_high/insert', values)
          .then((response) => {
            toast.success(response.data.message)
            formik.resetForm()
            setValidated(false)
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
          })
      } else {
        toast.warning('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    formik.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text') {
      const titleCaseValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      formik.setFieldValue(name, titleCaseValue)
    } else {
      formik.setFieldValue(name, value)
    }

    if (type === 'date') {
      const birthDate = new Date(value)
      const currentDate = new Date()

      const ageInMilliseconds = currentDate - birthDate
      const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))

      formik.setFieldValue('age', ageInYears)
    }
  }
  return (
    <div>
      <ToastContainer />
      <RequiredFieldNote />
      <CForm
        className="row g-3 needs-validation mt-4"
        noValidate
        validated={validated}
        onSubmit={formik.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CRow className="justify-content-between">
          <CCol md={7} sm={6} xs={6} lg={4} xl={4}>
            <CFormLabel>{RequiredField('Application Number ')}</CFormLabel>
            <CInputGroup className="mb-3 ">
              <CFormInput
                type="text"
                name="app_no_year"
                onChange={handleInputChange}
                value={formik.values.app_no_year}
                className="text-center"
                placeholder="Year"
                aria-label="Year"
                required
                // readOnly
              />
              <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
              <CFormInput
                type="text"
                name="app_no_sem"
                onChange={handleInputChange}
                value={formik.values.app_no_sem}
                className="text-center "
                placeholder="Semester"
                aria-label="Sem"
                required
                // readOnly
              />
              <CInputGroupText className="bg-transparent font-weight-bolder">-</CInputGroupText>
              <CFormInput
                type="text"
                name="app_no_id"
                onChange={handleInputChange}
                value={formik.values.app_no_id}
                className="text-center"
                placeholder="App No"
                aria-label="App No"
                required
                // readOnly
              />
            </CInputGroup>
          </CCol>
          <CCol md={4}>
            <CFormLabel>Application Status</CFormLabel>
            <h3 className="text-danger text-decoration-underline">Pending</h3>
          </CCol>
        </CRow>

        <CRow className="my-2">
          <CCol md={4}>
            <CFormInput
              type="text"
              feedbackInvalid="First Name is required."
              label={RequiredField('First Name')}
              name="firstname"
              onChange={handleInputChange}
              value={formik.values.firstname}
              required
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              type="text"
              feedbackInvalid="Last Name is required."
              label={RequiredField('Last Name')}
              name="lastname"
              onChange={handleInputChange}
              value={formik.values.lastname}
              required
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              type="text"
              label="M.I"
              name="middle_initial"
              onChange={handleInputChange}
              value={formik.values.middle_initial}
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              type="text"
              label="Suffix"
              name="suffix"
              onChange={handleInputChange}
              value={formik.values.suffix}
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
              onChange={handleInputChange}
              value={formik.values.address}
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
              onChange={handleInputChange}
              value={formik.values.birthdate}
              required
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="number"
              feedbackInvalid="Age is required."
              label={RequiredField('Age')}
              name="age"
              onChange={handleInputChange}
              value={formik.values.age}
              required
              readOnly
            />
          </CCol>

          <CCol md={3}>
            <CFormSelect
              feedbackInvalid="Civil Status is required."
              label={RequiredField('Civil Status')}
              name="civil_status"
              onChange={handleInputChange}
              value={formik.values.civil_status}
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
              onChange={handleInputChange}
              value={formik.values.sex}
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
              onChange={handleInputChange}
              value={formik.values.contact_number}
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="text"
              feedbackInvalid="CTC # is required."
              label={RequiredField('CTC #')}
              name="ctc_number"
              onChange={handleInputChange}
              value={formik.values.ctc_number}
              required
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="text"
              label="Facebook/Others"
              name="email_address"
              onChange={handleInputChange}
              value={formik.values.email_address}
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="number"
              feedbackInvalid="Availment is required."
              label={RequiredField('Availment')}
              name="availment"
              onChange={handleInputChange}
              value={formik.values.availment}
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
              onChange={handleInputChange}
              value={formik.values.school}
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
              label={RequiredField('Strand')}
              name="strand"
              onChange={handleInputChange}
              value={formik.values.strand}
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
              onChange={handleInputChange}
              value={formik.values.school_address}
            />
          </CCol>
        </CRow>

        <CRow className="my-2">
          <CCol md={4}>
            <CFormSelect
              feedbackInvalid="Grade Level is required."
              label={RequiredField('Grade Level')}
              name="grade_level"
              onChange={handleInputChange}
              value={formik.values.grade_level}
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
              label={RequiredField('Semester')}
              name="semester"
              onChange={handleInputChange}
              value={formik.values.semester}
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
              label={RequiredField('School Year')}
              name="school_year"
              onChange={handleInputChange}
              value={formik.values.school_year}
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
              onChange={handleInputChange}
              value={formik.values.father_name}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              label="Occupation"
              name="father_occupation"
              onChange={handleInputChange}
              value={formik.values.father_occupation}
            />
          </CCol>
        </CRow>

        <CRow className="my-2">
          <CCol md={6}>
            <CFormInput
              type="text"
              label="Mother's Name"
              name="mother_name"
              onChange={handleInputChange}
              value={formik.values.mother_name}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              type="text"
              label="Occupation"
              name="mother_occupation"
              onChange={handleInputChange}
              value={formik.values.mother_occupation}
            />
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <div className="d-grid gap-2">
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </div>
        </CRow>
      </CForm>
      {loadingOperation && <DefaultLoading />}
    </div>
  )
}

export default SeniorHigh
