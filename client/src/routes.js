import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Search = React.lazy(() => import('./views/search/Search'))
const Registration = React.lazy(() => import('./views/registration/Registration'))
// Manage Application
const Approved = React.lazy(() => import('./views/approved/Approved'))
const Pending = React.lazy(() => import('./views/pending/Pending'))
const Disapproved = React.lazy(() => import('./views/disapproved/Disapproved'))
const Archived = React.lazy(() => import('./views/archived/Archived'))
const Void = React.lazy(() => import('./views/void/Void'))

// School
const SeniorHighSchool = React.lazy(() => import('./views/school/SeniorHighSchool'))
const CollegeSchool = React.lazy(() => import('./views/school/CollegeSchool'))

// Course/Strand
const Course = React.lazy(() => import('./views/course/Course'))
const Strand = React.lazy(() => import('./views/course/Strand'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/registration', name: 'Registration', element: Registration },
  { path: '/search', name: 'Advance Search', element: Search },

  { path: '/manage', name: 'Manage', element: Approved, exact: true },
  { path: '/manage/approved', name: 'Approved', element: Approved },
  { path: '/manage/pending', name: 'Pending', element: Pending },
  { path: '/manage/disapproved', name: 'Disapproved', element: Disapproved },
  { path: '/manage/archived', name: 'Archived', element: Archived },
  { path: '/manage/void', name: 'Void', element: Void },

  { path: '/school', name: 'School', element: SeniorHighSchool, exact: true },
  {
    path: '/school/senior_high',
    name: 'Senior High School',
    element: SeniorHighSchool,
  },
  {
    path: '/school/college',
    name: 'College/Tvet School',
    element: CollegeSchool,
  },

  { path: '/manage', name: 'Manage', element: Strand, exact: true },
  { path: '/manage/strand', name: 'Strand', element: Strand },
  { path: '/manage/course', name: 'Course', element: Course },
]

export default routes
