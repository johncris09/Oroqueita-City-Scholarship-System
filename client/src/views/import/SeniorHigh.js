import React, { useState, useEffect, useCallback } from 'react'
import './../../assets/css/react-paginate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt, faFileExcel, faUpload } from '@fortawesome/free-solid-svg-icons'
import {
  CAlert,
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading } from 'src/components/Loading'
import * as XLSX from 'xlsx'
import template from './../../assets/template/Senior High Template.xlsx'
import api from 'src/components/Api'
import HandleError from 'src/components/HandleError'
import { useDropzone } from 'react-dropzone'
import FormatFileSize from 'src/components/FormatFileSize'
import moment from 'moment'
import { toSentenceCase } from 'src/components/FormatCase'

const SeniorHigh = () => {
  const [show, setShow] = useState(true)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [uploadedFileSize, setUploadedFileSize] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileEvent, setSelectedFileEvent] = useState(null)
  const [data, setData] = useState([])

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
        setData([])
      } else {
        setUploadedFileName(file.name)
        setUploadedFileSize(FormatFileSize(file.size))
        setSelectedFileEvent(acceptedFiles)
        setSelectedFile(acceptedFiles[0])

        const reader = new FileReader()

        reader.onload = (acceptedFiles) => {
          const data = new Uint8Array(acceptedFiles.target.result)
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
              setData(transformedData)
            } else {
              // The headers do not match the expected headers
              toast.error('Records sheet found, but the headers are incorrect.')
              setData([])
            }
          } else {
            // The sheet with the specified name does not exist
            toast.error('Records sheet not found in the Excel file.')
            setData([])
          }
        }

        reader.readAsArrayBuffer(file)
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
    try {
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
                  setData([])
                })
            } else {
              toast.error('Imported file is empty.')
              setUploadedFileName(null)
              setUploadedFileSize(null)
              setSelectedFileEvent(null)
              setSelectedFile(null)
              setData([])
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
    } catch (error) {
      toast.error('No file selected')
    }
  }

  const transformData = (originalData) => {
    const transformedData = originalData
      .filter((row) => row !== undefined && row.length > 0)
      .slice(1)
      .map((row) => {
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

          if (customKey === 'AppDOB') {
            const serialNumber = row[index]
            const excelDate = new Date((serialNumber - 25569) * 86400 * 1000)
            result[customKey] =
              row[index] === undefined ? '' : moment(excelDate).format('MM/DD/YYYY')
          } else if (
            customKey === 'AppLastName' ||
            customKey === 'AppFirstName' ||
            customKey === 'AppMidIn' ||
            customKey === 'AppSchoolAddress' ||
            customKey === 'AppFather' ||
            customKey === 'AppFatherOccu' ||
            customKey === 'AppMother' ||
            customKey === 'AppMotherOccu'
          ) {
            result[customKey] = row[index] === undefined ? '' : toSentenceCase(row[index])
          } else {
            result[customKey] = row[index] === undefined ? '' : row[index]
          }
        })
        return result
      })

    return transformedData
  }
  const tableStyle = {
    whiteSpace: 'nowrap',
    fontSize: 12,
    lineHeight: 0.3,
    height: '50% !important',
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
            {data.length > 0 && (
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
                  setData([])
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
                      <span style={{ fontSize: 12 }}>
                        File Name:
                        <u>
                          <strong>{uploadedFileName}</strong>
                        </u>
                      </span>
                      <br />
                      <span style={{ fontSize: 11 }}>File Size: {uploadedFileSize}</span>
                    </p>
                  </CCol>
                </CRow>
              </CAlert>
            )}
          </div>
        </CCol>
      </CRow>

      {data.length > 0 && (
        <CRow className="justify-content-center">
          <CCol md={12}>
            <hr />
            <CTable
              caption="top"
              align="middle"
              responsive
              striped
              borderColor="secondary"
              bordered
              style={tableStyle}
            >
              <CTableCaption>
                <h6>File Preview</h6>
                <p style={{ color: 'red' }}>
                  Kindly review the imported file before proceeding with the upload.
                </p>
              </CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Application Year</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Application Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Application Semester</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Application Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">First Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Middle Initial</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Suffix</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Birthdate</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Civil Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">CTC</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email Address </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Availment</CTableHeaderCell>
                  <CTableHeaderCell scope="col">School</CTableHeaderCell>
                  <CTableHeaderCell scope="col">School Address </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Strand</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Grade Level</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Semester</CTableHeaderCell>
                  <CTableHeaderCell scope="col">School Year</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Father’s Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Father’s Occupation </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mother’s Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mother’s Occupation</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((row, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell scope="row">{index + 1}</CTableDataCell>
                    <CTableDataCell>{row.AppNoYear}</CTableDataCell>
                    <CTableDataCell>{row.AppNoID}</CTableDataCell>
                    <CTableDataCell>{row.AppNoSem}</CTableDataCell>
                    <CTableDataCell>{row.AppStatus}</CTableDataCell>
                    <CTableDataCell>{row.AppLastName}</CTableDataCell>
                    <CTableDataCell>{row.AppFirstName}</CTableDataCell>
                    <CTableDataCell>{row.AppMidIn}</CTableDataCell>
                    <CTableDataCell>{row.AppSuffix}</CTableDataCell>
                    <CTableDataCell>{row.AppAddress}</CTableDataCell>
                    <CTableDataCell>{row.AppDOB}</CTableDataCell>
                    <CTableDataCell>{row.AppAge}</CTableDataCell>
                    <CTableDataCell>{row.AppCivilStat}</CTableDataCell>
                    <CTableDataCell>{row.AppGender}</CTableDataCell>
                    <CTableDataCell>{row.AppContact}</CTableDataCell>
                    <CTableDataCell>{row.AppCTC}</CTableDataCell>
                    <CTableDataCell>{row.AppEmailAdd}</CTableDataCell>
                    <CTableDataCell>{row.AppAvailment}</CTableDataCell>
                    <CTableDataCell>{row.AppSchool}</CTableDataCell>
                    <CTableDataCell>{row.AppSchoolAddress}</CTableDataCell>
                    <CTableDataCell>{row.AppCourse}</CTableDataCell>
                    <CTableDataCell>{row.AppYear}</CTableDataCell>
                    <CTableDataCell>{row.AppSem}</CTableDataCell>
                    <CTableDataCell>{row.AppSY}</CTableDataCell>
                    <CTableDataCell>{row.AppFather}</CTableDataCell>
                    <CTableDataCell>{row.AppFatherOccu}</CTableDataCell>
                    <CTableDataCell>{row.AppMother}</CTableDataCell>
                    <CTableDataCell>{row.AppMotherOccu}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="d-grid gap-2 mt-3">
              <CButton
                color="primary"
                className="mt-2"
                onClick={handleUploadFile}
                variant="outline"
              >
                <FontAwesomeIcon icon={faUpload} /> Upload File
              </CButton>
            </div>
          </CCol>
        </CRow>
      )}

      {loading && <DefaultLoading />}
      <CRow>
        <CCol>
          <p className="text-muted text-small mt-5">
            <hr />
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
