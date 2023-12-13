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
import template from './../../assets/template/Tvet Template.xlsx'
import api from 'src/components/Api'
import HandleError from 'src/components/HandleError'
import { useDropzone } from 'react-dropzone'
import FormatFileSize from 'src/components/FormatFileSize'
import moment from 'moment'
import { toSentenceCase } from 'src/components/FormatCase'

const Tvet = () => {
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
            'Course',
            'Number of Hours',
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
          'Course',
          'Number of Hours',
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
            // The headers match the expected headers
            const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            const transformedData = transformData(records)

            if (transformedData.length > 0) {
              setLoading(true)
              api
                .post('tvet/bulk_insert', { ...transformedData })
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
          'Number of Hours': 'colUnits',
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

          if (customKey === 'colDOB') {
            const serialNumber = row[index]
            const excelDate = new Date((serialNumber - 25569) * 86400 * 1000)
            result[customKey] =
              row[index] === undefined ? '' : moment(excelDate).format('MM/DD/YYYY')
          } else if (
            customKey === 'colLastName' ||
            customKey === 'colFirstName' ||
            customKey === 'colMI' ||
            customKey === 'colSchoolAddress' ||
            customKey === 'colFathersName' ||
            customKey === 'colFatherOccu' ||
            customKey === 'colMothersName' ||
            customKey === 'colMotherOccu'
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
                  <CTableHeaderCell scope="col">Course</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Number of Hours</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Year Level</CTableHeaderCell>
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
                    <CTableDataCell>{row.colAppNoYear}</CTableDataCell>
                    <CTableDataCell>{row.colAppNoID}</CTableDataCell>
                    <CTableDataCell>{row.colAppNoSem}</CTableDataCell>
                    <CTableDataCell>{row.colAppStat}</CTableDataCell>
                    <CTableDataCell>{row.colLastName}</CTableDataCell>
                    <CTableDataCell>{row.colFirstName}</CTableDataCell>
                    <CTableDataCell>{row.colMI}</CTableDataCell>
                    <CTableDataCell>{row.colSuffix}</CTableDataCell>
                    <CTableDataCell>{row.colAddress}</CTableDataCell>
                    <CTableDataCell>{row.colDOB}</CTableDataCell>
                    <CTableDataCell>{row.colAge}</CTableDataCell>
                    <CTableDataCell>{row.colCivilStat}</CTableDataCell>
                    <CTableDataCell>{row.colGender}</CTableDataCell>
                    <CTableDataCell>{row.colContactNo}</CTableDataCell>
                    <CTableDataCell>{row.colCTC}</CTableDataCell>
                    <CTableDataCell>{row.colEmailAdd}</CTableDataCell>
                    <CTableDataCell>{row.colAvailment}</CTableDataCell>
                    <CTableDataCell>{row.colSchool}</CTableDataCell>
                    <CTableDataCell>{row.colSchoolAddress}</CTableDataCell>
                    <CTableDataCell>{row.colCourse}</CTableDataCell>
                    <CTableDataCell>{row.colUnits}</CTableDataCell>
                    <CTableDataCell>{row.colYearLevel}</CTableDataCell>
                    <CTableDataCell>{row.colSem}</CTableDataCell>
                    <CTableDataCell>{row.colSY}</CTableDataCell>
                    <CTableDataCell>{row.colFathersName}</CTableDataCell>
                    <CTableDataCell>{row.colFatherOccu}</CTableDataCell>
                    <CTableDataCell>{row.colMothersName}</CTableDataCell>
                    <CTableDataCell>{row.colMotherOccu}</CTableDataCell>
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
export default Tvet
