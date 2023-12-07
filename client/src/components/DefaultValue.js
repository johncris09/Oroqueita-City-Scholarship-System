import React from 'react'
import { Box } from '@mui/material'

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
  },
  {
    accessorKey: 'AppFirstName',
    header: 'First Name',
  },
  {
    accessorKey: 'AppMidIn',
    header: 'Middle Name',
  },
  {
    accessorKey: 'AppContact',
    header: 'Contact #',
  },
  {
    accessorKey: 'AppAddress',
    header: 'Address',
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
    header: 'Strand',
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
    header: 'Strand',
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
export {
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
