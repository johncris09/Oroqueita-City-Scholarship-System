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
import {
  Address,
  CivilStatus,
  DefaultLoading,
  SchoolYear,
  Semester,
  Sex,
  YearLevel,
  api,
  decrypted,
  handleError,
  requiredField,
} from 'src/components/Oroqscholarship'

const Tvet = () => {
  const [validated, setValidated] = useState(false)
  const [school, setSchool] = useState([])
  const [course, setCourse] = useState([])
  const [loadingOperation, setLoadingOperation] = useState(false)

  useEffect(() => {
    fetchSchool()
    fetchCourse()
    fetchappno()
  }, [school])

  const fetchappno = async () => {
    await api
      .get('system_sequence/tvet_appno')
      .then((response) => {
        formik.setFieldValue('app_no_year', response.data.seq_year)
        formik.setFieldValue('app_no_sem', response.data.seq_sem)
        formik.setFieldValue('app_no_id', parseInt(response.data.seq_appno) + 1)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }
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
      course: '',
      school_address: '',
      year_level: '',
      semester: '',
      hour_number: '',
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
          .post('tvet/insert', values)
          .then((response) => {
            toast.success(response.data.message)
            formik.resetForm()
            setValidated(false)
          })
          .catch((error) => {
            toast.error(handleError(error))
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
      <requiredFieldNote />
      <CForm
        className="row g-3 needs-validation mt-4"
        noValidate
        validated={validated}
        onSubmit={formik.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CRow className="justify-content-between">
          <CCol md={7} sm={6} xs={6} lg={4} xl={4}>
            <CFormLabel>{requiredField('Application Number ')}</CFormLabel>
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
                readOnly
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
                readOnly
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
                readOnly
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
              label={requiredField('First Name')}
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
              label={requiredField('Last Name')}
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
              label={requiredField('Address')}
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
              label={requiredField('Date of Birth')}
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
              label={requiredField('Age')}
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
              label={requiredField('Civil Status')}
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
              label={requiredField('Sex')}
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
              label={requiredField('CTC #')}
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
              label={requiredField('Availment')}
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
              label={requiredField('School')}
              name="school"
              onChange={handleInputChange}
              value={formik.values.school}
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
              label={requiredField('Course')}
              name="course"
              onChange={handleInputChange}
              value={formik.values.course}
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
              onChange={handleInputChange}
              value={formik.values.school_address}
            />
          </CCol>
        </CRow>

        <CRow className="my-2">
          <CCol md={3}>
            <CFormSelect
              feedbackInvalid="Year Level is required."
              label={requiredField('Year Level')}
              name="year_level"
              onChange={handleInputChange}
              value={formik.values.year_level}
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
              label={requiredField('Semester')}
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

          <CCol md={3}>
            <CFormInput
              type="number"
              feedbackInvalid="No. of Hours is required."
              label={requiredField('No. of Hours')}
              name="hour_number"
              onChange={handleInputChange}
              value={formik.values.hour_number}
              required
            />
          </CCol>
          <CCol md={3}>
            <CFormSelect
              feedbackInvalid="School Year is required."
              label={requiredField('School Year')}
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

export default Tvet
