import React from 'react'
import { Box } from '@mui/material'
import { ExportToCsv } from 'export-to-csv'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { Oval } from 'react-loader-spinner'
import Swal from 'sweetalert2'

const isProduction = false

const api = axios.create({
  baseURL: isProduction
    ? process.env.REACT_APP_BASEURL_PRODUCTION
    : process.env.REACT_APP_BASEURL_DEVELOPMENT,

  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
})

const currentYear = new Date().getFullYear()
const lastYear = 2017
const SchoolYear = []

const Address = [
  'Apil',
  'Binuangan',
  'Bolibol',
  'Buenavista',
  'Bunga',
  'Buntawan',
  'Burgos',
  'Canubay',
  'Ciriaco Pastrano',
  'Clarin Settlement',
  'Dolipos Alto',
  'Dolipos Bajo',
  'Dulapo',
  'Dullan Norte',
  'Dullan Sur',
  'Layawan',
  'Lower Lamac',
  'Lower Langcangan',
  'Lower Loboc',
  'Lower Rizal',
  'Malindang',
  'Mialen',
  'Mobod',
  'Paypayan',
  'Pines',
  'Poblacion 1',
  'Poblacion 2',
  'Proper Langcangan',
  'San Vicente Alto',
  'San Vicente Bajo',
  'Sebucal',
  'Senote',
  'Taboc Norte',
  'Taboc Sur',
  'Talairon',
  'Talic',
  'Tipan',
  'Toliyok',
  'Tuyabang Alto',
  'Tuyabang Bajo',
  'Tuyabang Proper',
  'Upper Lamac',
  'Upper Langcangan',
  'Upper Loboc',
  'Upper Rizal',
  'Victoria',
  'Villaflor',
]

const CivilStatus = ['Single', 'Married', 'Widowed']

const Sex = ['Male', 'Female']

const GradeLevel = ['Grade 11', 'Grade 12']
const YearLevel = ['I', 'II', 'III', 'IV', 'V']
const Semester = ['1st', '2nd']

for (let year = currentYear; year >= lastYear; year--) {
  SchoolYear.push('SY: ' + year + '-' + (year + 1))
}

const Manager = ['Active', 'Inactive']
const ApprovedType = [
  'Approved',
  'Additional Approved',
  'Additional Approved 1',
  'Additional Approved 2',
  'Additional Approved 3',
  'Additional Approved 4',
  'Additional Approved 5',
  'Additional Approved 6',
]

const StatusType = [
  'Pending',
  'Approved',
  'Additional Approved',
  'Additional Approved 1',
  'Additional Approved 2',
  'Additional Approved 3',
  'Additional Approved 4',
  'Additional Approved 5',
  'Additional Approved 6',
  'Disapproved',
  'Void',
  'Archived',
]

const seniorHighDefaultColumn = [
  {
    accessorKey: 'AppNoID',
    header: 'Application #',
    accessorFn: (row) => `${row.AppNoYear}-${row.AppNoSem}-${row.AppNoID}`,
    //custom conditional format and styling
    Cell: ({ cell }) => (
      <Box
        fontSize={12}
        component="span"
        sx={(theme) => ({
          backgroundColor: '#757575',
          borderRadius: '0.25rem',
          color: '#fff',
          maxWidth: '20ch',
          p: '0.05rem',
        })}
      >
        {cell.getValue()}
      </Box>
    ),
  },
  {
    accessorKey: 'AppLastName',
    header: 'Last Name',
    accessorFn: (row) => `${toSentenceCase(row.AppLastName)}`,
  },
  {
    accessorKey: 'AppFirstName',
    header: 'First Name',
    accessorFn: (row) => `${toSentenceCase(row.AppFirstName)}`,
  },
  {
    accessorKey: 'AppMidIn',
    header: 'Middle Name',
    accessorFn: (row) => `${toSentenceCase(row.AppMidIn)}`,
  },
  {
    accessorKey: 'AppContact',
    header: 'Contact #',
  },
  {
    accessorKey: 'AppAddress',
    header: 'Address',
    accessorFn: (row) => `${toSentenceCase(row.AppAddress)}`,
  },
  {
    accessorKey: 'AppGender',
    header: 'Gender',
  },
  {
    accessorKey: 'AppSchool',
    header: 'School',
  },
  {
    accessorKey: 'AppCourse',
    header: 'Strand',
  },
  {
    accessorKey: 'AppSY',
    header: 'School Year',
  },
  {
    accessorKey: 'AppSem',
    header: 'Semester',
  },
  {
    accessorKey: 'AppStatus',
    header: 'Application Status',
  },
  {
    accessorKey: 'AppAvailment',
    header: 'Availment',
  },
]

const collegeDefaultColumn = [
  {
    accessorKey: 'colAppNoID',
    header: 'Application #',
    accessorFn: (row) => `${row.colAppNoYear}-${row.colAppNoSem}-${row.colAppNoID}`,
    //custom conditional format and styling
    Cell: ({ cell }) => (
      <Box
        fontSize={12}
        component="span"
        sx={(theme) => ({
          backgroundColor: '#757575',
          borderRadius: '0.25rem',
          color: '#fff',
          maxWidth: '20ch',
          p: '0.05rem',
        })}
      >
        {cell.getValue()}
      </Box>
    ),
  },
  {
    accessorKey: 'colLastName',
    header: 'Last Name',
    accessorFn: (row) => `${toSentenceCase(row.colLastName)}`,
  },
  {
    accessorKey: 'colFirstName',
    header: 'First Name',
    accessorFn: (row) => `${toSentenceCase(row.colFirstName)}`,
  },
  {
    accessorKey: 'colMI',
    header: 'Middle Name',
    accessorFn: (row) => `${toSentenceCase(row.colMI)}`,
  },
  {
    accessorKey: 'colContactNo',
    header: 'Contact #',
  },
  {
    accessorKey: 'colAddress',
    header: 'Address',
    accessorFn: (row) => `${toSentenceCase(row.colAddress)}`,
  },
  {
    accessorKey: 'colGender',
    header: 'Gender',
  },
  {
    accessorKey: 'colSchool',
    header: 'School',
  },
  {
    accessorKey: 'colCourse',
    header: 'Course',
  },
  {
    accessorKey: 'colSY',
    header: 'School Year',
  },
  {
    accessorKey: 'colSem',
    header: 'Semester',
  },
  {
    accessorKey: 'colAppStat',
    header: 'Application Status',
  },
  {
    accessorKey: 'colAvailment',
    header: 'Availment',
  },
]

const tvetDefaultColumn = [
  {
    accessorKey: 'colAppNoID',
    header: 'Application #',
    accessorFn: (row) => `${row.colAppNoYear}-${row.colAppNoSem}-${row.colAppNoID}`,
    //custom conditional format and styling
    Cell: ({ cell }) => (
      <Box
        fontSize={12}
        component="span"
        sx={(theme) => ({
          backgroundColor: '#757575',
          borderRadius: '0.25rem',
          color: '#fff',
          maxWidth: '20ch',
          p: '0.05rem',
        })}
      >
        {cell.getValue()}
      </Box>
    ),
  },
  {
    accessorKey: 'colLastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'colFirstName',
    header: 'First Name',
  },
  {
    accessorKey: 'colMI',
    header: 'Middle Name',
  },
  {
    accessorKey: 'colContactNo',
    header: 'Contact #',
  },
  {
    accessorKey: 'colAddress',
    header: 'Address',
  },
  {
    accessorKey: 'colGender',
    header: 'Gender',
  },
  {
    accessorKey: 'colSchool',
    header: 'School',
  },
  {
    accessorKey: 'colCourse',
    header: 'Course',
  },
  {
    accessorKey: 'colSY',
    header: 'School Year',
  },
  {
    accessorKey: 'colSem',
    header: 'Semester',
  },
  {
    accessorKey: 'colAppStat',
    header: 'Application Status',
  },
  {
    accessorKey: 'colAvailment',
    header: 'Availment',
  },
]
const commiteeChairperson = 'MARK ANTHONY D. ARTIGAS'
const cityMayor = 'LEMUEL MEYRICK M. ACOSTA'

const csvOptions = (column) => {
  return {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }
}

const handleExportSeniorHighRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(seniorHighDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.AppNoYear}-${item.AppNoSem}-${item.AppNoID}`,
        'First Name': toSentenceCase(item.AppFirstName),
        'Last Name': toSentenceCase(item.AppLastName),
        'Middle Name': toSentenceCase(item.AppMidIn),
        Address: toSentenceCase(item.AppAddress),
        'Contact #': item.AppContact,
        Gender: item.AppGender,
        School: item.AppSchool,
        Strand: item.AppCourse,
        'School Year': item.AppSY,
        Semester: item.AppSem,
        'Application Status': item.AppStatus,
        Availment: item.AppAvailment,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportSeniorHighData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(seniorHighDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.AppNoYear}-${item.AppNoSem}-${item.AppNoID}`,
      'First Name': toSentenceCase(item.AppFirstName),
      'Last Name': toSentenceCase(item.AppLastName),
      'Middle Name': toSentenceCase(item.AppMidIn),
      Address: toSentenceCase(item.AppAddress),
      'Contact #': item.AppContact,
      Gender: item.AppGender,
      School: item.AppSchool,
      Strand: item.AppCourse,
      'School Year': item.AppSY,
      Semester: item.AppSem,
      'Application Status': item.AppStatus,
      Availment: item.AppAvailment,
    }
  })

  csvExporter.generateCsv(exportedData)
}

const handleExportCollegeRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(collegeDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
        'First Name': toSentenceCase(item.colFirstName),
        'Last Name': toSentenceCase(item.colLastName),
        'Middle Name': toSentenceCase(item.colMI),
        Address: toSentenceCase(item.colAddress),
        'Contact #': item.colContactNo,
        Gender: item.colGender,
        School: item.colSchool,
        Course: item.colCourse,
        'School Year': item.colSY,
        Semester: item.colSem,
        'Application Status': item.colAppStat,
        Availment: item.colAvailment,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportCollegeData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(collegeDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
      'First Name': toSentenceCase(item.colFirstName),
      'Last Name': toSentenceCase(item.colLastName),
      'Middle Name': toSentenceCase(item.colMI),
      Address: toSentenceCase(item.colAddress),
      'Contact #': item.colContactNo,
      Gender: item.colGender,
      School: item.colSchool,
      Course: item.colCourse,
      'School Year': item.colSY,
      Semester: item.colSem,
      'Application Status': item.colAppStat,
      Availment: item.colAvailment,
    }
  })

  csvExporter.generateCsv(exportedData)
}
const handleExportTvetRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(tvetDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
        'First Name': toSentenceCase(item.colFirstName),
        'Last Name': toSentenceCase(item.colLastName),
        'Middle Name': toSentenceCase(item.colMI),
        Address: toSentenceCase(item.colAddress),
        'Contact #': item.colContactNo,
        Gender: item.colGender,
        School: item.colSchool,
        Strand: item.colCourse,
        'School Year': item.colSY,
        Semester: item.colSem,
        'Application Status': item.colAppStat,
        Availment: item.colAvailment,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportTvetData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(tvetDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
      'First Name': toSentenceCase(item.colFirstName),
      'Last Name': toSentenceCase(item.colLastName),
      'Middle Name': toSentenceCase(item.colMI),
      Address: toSentenceCase(item.colAddress),
      'Contact #': item.colContactNo,
      Gender: item.colGender,
      School: item.colSchool,
      Strand: item.colCourse,
      'School Year': item.colSY,
      Semester: item.colSem,
      'Application Status': item.colAppStat,
      Availment: item.colAvailment,
    }
  })

  csvExporter.generateCsv(exportedData)
}

const asterisk = () => {
  return <span className="text-danger">*</span>
}

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) }
    if (cipherParams.iv) j.iv = cipherParams.iv.toString()
    if (cipherParams.salt) j.s = cipherParams.salt.toString()
    return JSON.stringify(j)
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr)
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    })
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams
  },
}

const decrypted = (data) => {
  const decryptedData = JSON.parse(
    CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY, {
      format: CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8),
  )

  return JSON.parse(decryptedData)
}
const encrypt = (data) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_ENCRYPTION_KEY, {
    format: CryptoJSAesJson,
  }).toString()

  return encrypted
}

const toSentenceCase = (value) => {
  try {
    return value
      .toLowerCase()
      .split(' ')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ')
  } catch (error) {
    return value
  }
}

const formatFileSize = (size) => {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(size) / Math.log(k)))
  return Math.round(100 * (size / Math.pow(k, i))) / 100 + ' ' + sizes[i]
}

const calculateAge = (value) => {
  try {
    const birthDate = new Date(value)
    const currentDate = new Date()

    const ageInMilliseconds = currentDate - birthDate
    const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))
    return ageInYears
  } catch (error) {
    return value
  }
}

const handleError = (error) => {
  let errorMessage

  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Resource not found. Please check the URL!'
      break
    case 'ERR_BAD_RESPONSE':
      errorMessage = 'Internal Server Error. Please try again later.'
      break
    case 'ERR_NETWORK':
      errorMessage = 'Please check your internet connection and try again!'
      break
    case 'ECONNABORTED':
      errorMessage = 'The request timed out. Please try again later.'
      break
    case 'ERR_SERVER':
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Internal Server Error. Please try again later.'
        } else if (error.response.status === 404) {
          errorMessage = 'Resource not found. Please check the URL.'
        } else if (error.response.status === 403) {
          errorMessage = 'Access forbidden. Please check your permissions.'
        } else {
          errorMessage = `Unexpected server error: ${error.response.status}`
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      break
    case 'ERR_CLIENT':
      if (error.response && error.response.status === 400) {
        errorMessage = 'Bad request. Please check your input.'
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.'
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else {
        errorMessage = 'Client error. Please check your request.'
      }
      break
    default:
      console.error('An error occurred:', error)
      errorMessage = 'An unexpected error occurred. Please try again.'
      break
  }

  return errorMessage
}

const DefaultLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={40}
        width={40}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const WidgetLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.001)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={30}
        width={30}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const requiredFieldNote = (label) => {
  return (
    <>
      <div>
        <small className="text-muted">
          Note: <span className="text-danger">*</span> is required
        </small>
      </div>
    </>
  )
}
const requiredField = (label) => {
  return (
    <>
      <span>
        {label} <span className="text-danger">*</span>
      </span>
    </>
  )
}

const validationPrompt = (operationCallback) => {
  try {
    Swal.fire({
      title: 'Please enter the secret key to proceed.',
      input: 'password',
      icon: 'info',
      customClass: {
        validationMessage: 'my-validation-message',
        alignment: 'text-center',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('This field is required')
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then(async function (result) {
      if (result.isConfirmed) {
        if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
          operationCallback()
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Invalid Secrey Key',
            icon: 'error',
          })
        }
      }
    })
  } catch (error) {
    return false
  }
}

export {
  validationPrompt,
  requiredField,
  requiredFieldNote,
  DefaultLoading,
  WidgetLoading,
  handleError,
  calculateAge,
  formatFileSize,
  toSentenceCase,
  decrypted,
  encrypt,
  asterisk,
  handleExportSeniorHighData,
  handleExportSeniorHighRows,
  handleExportCollegeData,
  handleExportCollegeRows,
  handleExportTvetData,
  handleExportTvetRows,
  api,
  Address,
  CivilStatus,
  Sex,
  GradeLevel,
  Semester,
  SchoolYear,
  YearLevel,
  Manager,
  ApprovedType,
  StatusType,
  seniorHighDefaultColumn,
  collegeDefaultColumn,
  tvetDefaultColumn,
  commiteeChairperson,
  cityMayor,
}
