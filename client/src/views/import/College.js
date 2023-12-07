import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CInputGroup, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading } from 'src/components/Loading'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import template from './../../assets/template/College Template.xlsx'
import * as XLSX from 'xlsx'
import api from 'src/components/Api'
import HandleError from 'src/components/HandleError'

const College = () => {
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
              'Course',
              'Units',
              'Year Level',
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
                  .post('college/bulk_insert', { ...transformedData })
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
        'Application Year': 'colAppNoYear',
        'Application Number': 'colAppNoID',
        'Application Semester': 'colAppNoSem',
        'Application Status': 'colAppStat',
        'Last Name': 'colLastName',
        'First Name': 'colFirstName',
        'Middle Initial': 'colMI',
        Suffix: 'colSuffix',
        Address: 'colAddress',
        Birthdate: 'colDOB',
        Age: 'colAge',
        'Civil Status': 'colCivilStat',
        Gender: 'colGender',
        'Contact Number': 'colContactNo',
        CTC: 'colCTC',
        'Email Address': 'colEmailAdd',
        Availment: 'colAvailment',
        School: 'colSchool',
        'School Address': 'colSchoolAddress',
        Course: 'colCourse',
        Units: 'colUnits',
        'Year Level': 'colYearLevel',
        Semester: 'colSem',
        'School Year': 'colSY',
        'Father’s Name': 'colFathersName',
        'Father’s Occupation': 'colFatherOccu',
        'Mother’s Name': 'colMothersName',
        'Mother’s Occupation': 'colMotherOccu',
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

export default College
