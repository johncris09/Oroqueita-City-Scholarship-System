import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CInputGroup, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading } from 'src/components/Loading'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import * as XLSX from 'xlsx'
import template from './../../assets/template/Senior High Template.xlsx'
import api from 'src/components/Api'
import HandleError from 'src/components/HandleError'

const SeniorHigh = () => {
  const [validated, setValidated] = useState(false)
  const [editValidated, setEditValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileEvent, setSelectedFileEvent] = useState(null)

  useEffect(() => {}, [])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      setSelectedFileEvent(e)
      setSelectedFile(e.target.files[0])
    }
    form.setFieldValue(name, value)
  }

  const form = useFormik({
    initialValues: {
      file: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        if (selectedFile) {
          const reader = new FileReader()

          reader.onload = (selectedFileEvent) => {
            const data = new Uint8Array(selectedFileEvent.target.result)
            const workbook = XLSX.read(data, { type: 'array' })

            // Specify the sheet name
            // Specify the name of the header
            const sheetName = 'Records'
            const expectedHeaders = [
              'Application Year',
              'Application Number',
              'Application Semester',
              'Application Status',
              'Last Name',
              'First Name',
              'Middle Initial',
              'Suffix',
              'Address',
              'Birthdate',
              'Age',
              'Civil Status',
              'Gender',
              'Contact Number',
              'CTC',
              'Email Address',
              'Availment',
              'School',
              'School Address',
              'Strand',
              'Grade Level',
              'Semester',
              'School Year',
              'Father’s Name',
              'Father’s Occupation',
              'Mother’s Name',
              'Mother’s Occupation',
            ]

            // Check if the sheet with the specified name exists in the workbook
            if (workbook.Sheets[sheetName]) {
              // The sheet with the specified name exists
              const worksheet = workbook.Sheets[sheetName]

              // Get the actual headers from the sheet
              const actualHeaders = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]

              // Check if the actual headers match the expected headers
              const headersMatch = JSON.stringify(actualHeaders) === JSON.stringify(expectedHeaders)

              if (headersMatch) {
                setLoading(true)
                // The headers match the expected headers
                const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                const transformedData = transformData(records)

                api
                  .post('senior_high/bulk_insert', { ...transformedData })
                  .then((response) => {
                    toast.success(response.data.message)
                    form.resetForm()
                  })
                  .catch((error) => {
                    toast.error(HandleError(error))
                  })
                  .finally(() => {
                    setLoading(false)
                  })
              } else {
                // The headers do not match the expected headers
                toast.error('Records sheet found, but the headers are incorrect.')
              }
            } else {
              // The sheet with the specified name does not exist
              toast.error('Records sheet not found in the Excel file.')
            }
          }

          reader.readAsArrayBuffer(selectedFile)
        }
      } else {
        toast.warning('Please select a file.')
        setEditValidated(true)
      }
    },
  })

  const transformData = (originalData) => {
    const transformedData = originalData.slice(1).map((row) => {
      const result = {}

      const headerMapping = {
        'Application Year': 'AppNoYear',
        'Application Number': 'AppNoID',
        'Application Semester': 'AppNoSem',
        'Application Status': 'AppStatus',
        'Last Name': 'AppLastName',
        'First Name': 'AppFirstName',
        'Middle Initial': 'AppMidIn',
        Suffix: 'AppSuffix',
        Address: 'AppAddress',
        Birthdate: 'AppDOB',
        Age: 'AppAge',
        'Civil Status': 'AppCivilStat',
        Gender: 'AppGender',
        'Contact Number': 'AppContact',
        CTC: 'AppCTC',
        'Email Address': 'AppEmailAdd',
        Availment: 'AppAvailment',
        School: 'AppSchool',
        'School Address': 'AppSchoolAddress',
        Strand: 'AppCourse',
        'Grade Level': 'AppYear',
        Semester: 'AppSem',
        'School Year': 'AppSY',
        'Father’s Name': 'AppFather',
        'Father’s Occupation': 'AppFatherOccu',
        'Mother’s Name': 'AppMother',
        'Mother’s Occupation': 'AppMotherOccu',
      }

      originalData[0].forEach((key, index) => {
        const customKey = headerMapping[key] || key // Use custom name if mapped, else use original
        result[customKey] = row[index] === undefined ? '' : row[index]

        // result[key] = row[index] === undefined ? '' : row[index]
      })
      return result
    })

    return transformedData
  }

  return (
    <>
      <ToastContainer />
      <CRow className="justify-content-center">
        <CCol md={12}>
          <RequiredFieldNote />
          <br />
          <CForm
            id="filterForm"
            className="row g-3 needs-validation mb-4"
            noValidate
            validated={validated}
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CFormLabel htmlFor="file">{RequiredField('Select File')}</CFormLabel>
            <CInputGroup>
              <CFormInput
                type="file"
                id="file"
                feedbackInvalid="Date of Birth is required."
                aria-label="Upload"
                onChange={handleInputChange}
                required
                name="file"
                value={form.values.file}
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              <CButton type="submit" color="primary" variant="outline" id="inputGroupFileAddon04">
                <FontAwesomeIcon icon={faDownload} /> Import
              </CButton>
            </CInputGroup>
            {loading && <DefaultLoading />}
          </CForm>
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-3">
        <CCol md={12}>
          <p className="text-muted text-small">
            Download the template <a href={template}>here</a>.
          </p>
        </CCol>
      </CRow>
    </>
  )
}

export default SeniorHigh
