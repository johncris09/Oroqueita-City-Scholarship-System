import React, { useState, useEffect, useCallback } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { CAlert, CButton, CCol, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading } from 'src/components/Loading'
import * as XLSX from 'xlsx'
import template from './../../assets/template/Senior High Template.xlsx'
import api from 'src/components/Api'
import HandleError from 'src/components/HandleError'
import { useDropzone } from 'react-dropzone'
import FormatFileSize from 'src/components/FormatFileSize'

const SeniorHigh = () => {
  const [show, setShow] = useState(true)

  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [uploadedFileSize, setUploadedFileSize] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileEvent, setSelectedFileEvent] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    // Check if only one file is dropped
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0]
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toast.error('Please upload an Excel file only.')
        setUploadedFileName(null)
        setUploadedFileSize(null)
        setSelectedFileEvent(null)
        setSelectedFile(null)
      } else {
        setUploadedFileName(file.name)
        setUploadedFileSize(FormatFileSize(file.size))
        setSelectedFileEvent(acceptedFiles)
        setSelectedFile(acceptedFiles[0])
      }
    } else {
      toast.error('Please upload only one file.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls',
  })

  const handleUploadFile = () => {
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
          // The headers match the expected headers
          const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          const transformedData = transformData(records)
          if (transformedData.length > 0) {
            setLoading(true)
            api
              .post('senior_high/bulk_insert', { ...transformedData })
              .then((response) => {
                toast.success(response.data.message)
              })
              .catch((error) => {
                toast.error(HandleError(error))
              })
              .finally(() => {
                setLoading(false)
                setUploadedFileName(null)
                setUploadedFileSize(null)
                setSelectedFileEvent(null)
                setSelectedFile(null)
              })
          } else {
            toast.error('Imported file is empty.')
            setUploadedFileName(null)
            setUploadedFileSize(null)
            setSelectedFileEvent(null)
            setSelectedFile(null)
          }
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
        <CCol md={6}>
          <div style={{ position: 'relative' }}>
            <div {...getRootProps()} style={dropzoneStyle}>
              <input
                {...getInputProps()}
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              {isDragActive ? (
                <p>Drop the Excel file here...</p>
              ) : (
                <>
                  <p>
                    <FontAwesomeIcon
                      icon={faCloudUploadAlt}
                      style={{ color: 'blue', fontSize: 70 }}
                    />
                  </p>
                  <p> Drag and drop an Excel file here, or click to select one </p>
                </>
              )}
            </div>
            {uploadedFileName && (
              <CAlert
                color="success"
                className="mt-3"
                dismissible
                onClose={() => {
                  setShow(false)
                  setUploadedFileName(null)
                  setUploadedFileSize(null)
                  setSelectedFileEvent(null)
                  setSelectedFile(null)
                }}
              >
                <CRow>
                  <CCol className="col-auto">
                    <FontAwesomeIcon
                      className="mr-4"
                      icon={faFileExcel}
                      style={{ color: 'green', fontSize: 40 }}
                    />
                  </CCol>
                  <CCol>
                    <p>
                      File Name:
                      <u>
                        <strong>{uploadedFileName}</strong>
                      </u>
                      <br />
                      File Size: {uploadedFileSize}
                    </p>
                  </CCol>
                </CRow>
              </CAlert>
            )}
            <div className="d-grid gap-2">
              <CButton
                color="primary"
                className="mt-2"
                onClick={handleUploadFile}
                variant="outline"
              >
                Upload File
              </CButton>
            </div>
            {loading && <DefaultLoading />}
          </div>
          <p className="text-muted text-small mt-5">
            Download the template <a href={template}>here</a>.
          </p>
        </CCol>
      </CRow>
    </>
  )
}
const dropzoneStyle = {
  border: '2px dashed blue',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
}
export default SeniorHigh
