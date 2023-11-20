import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibGooglesCholar,
  cilCog,
  cilDescription,
  cilMagnifyingGlass,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Advance Search',
    to: '/search',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Manage Application',
    to: '/manage',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Approved',
        to: '/manage/approved',
      },
      {
        component: CNavItem,
        name: 'Pending',
        to: '/manage/pending',
      },
      // {
      //   component: CNavItem,
      //   name: 'Archived',
      //   to: '/manage/archived',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Manage School',
    to: '/school',
    icon: <CIcon icon={cibGooglesCholar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Senior High School',
        to: '/school/senior_high',
      },
      {
        component: CNavItem,
        name: 'College/Tvet School',
        to: '/school/college',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Manage Course',
    to: '/manage',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Strand',
        to: '/manage/strand',
      },
      {
        component: CNavItem,
        name: 'Course',
        to: '/manage/course',
      },
    ],
  },
]

export default _nav
