import React from 'react'
import { Box } from '@mui/material'
import { toSentenceCase } from './FormatCase'
import { ExportToCsv } from 'export-to-csv'

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
        'First Name': item.AppFirstName,
        'Last Name': item.AppLastName,
        'Middle Name': item.AppMidIn,
        Address: item.AppAddress,
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
      'First Name': item.AppFirstName,
      'Last Name': item.AppLastName,
      'Middle Name': item.AppMidIn,
      Address: item.AppAddress,
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
        'First Name': item.colFirstName,
        'Last Name': item.colLastName,
        'Middle Name': item.colMI,
        Address: item.colAddress,
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
      'First Name': item.colFirstName,
      'Last Name': item.colLastName,
      'Middle Name': item.colMI,
      Address: item.colAddress,
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
//

const handleExportTvetRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(tvetDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.colAppNoYear}-${item.colAppNoSem}-${item.colAppNoID}`,
        'First Name': item.colFirstName,
        'Last Name': item.colLastName,
        'Middle Name': item.colMI,
        Address: item.colAddress,
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
      'First Name': item.colFirstName,
      'Last Name': item.colLastName,
      'Middle Name': item.colMI,
      Address: item.colAddress,
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

//
export {
  handleExportSeniorHighData,
  handleExportSeniorHighRows,
  handleExportCollegeData,
  handleExportCollegeRows,
  handleExportTvetData,
  handleExportTvetRows,
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
