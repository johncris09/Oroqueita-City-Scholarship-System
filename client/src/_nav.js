import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibGooglesCholar,
  cilCloudDownload,
  cilCog,
  cilDescription,
  cilFile,
  cilMagnifyingGlass,
  cilPlus,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = (userInfo) => {
  let items = [
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
      component: CNavItem,
      name: 'Registration',
      to: '/registration',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
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
        {
          component: CNavItem,
          name: 'Disapproved',
          to: '/manage/disapproved',
        },
        {
          component: CNavItem,
          name: 'Archived',
          to: '/manage/archived',
        },
        {
          component: CNavItem,
          name: 'Void',
          to: '/manage/void',
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Import',
      to: '/import',
      icon: <CIcon icon={cilCloudDownload} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'System Sequence',
      to: '/system_sequence',
      icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Config',
      to: '/config',
      icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Generated Report',
    },
    {
      component: CNavItem,
      name: 'Generate Report',
      to: '/generate_report',
      icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    },
  ]
  if (userInfo.role === 'Administrator') {
    items.push(
      {
        component: CNavTitle,
        name: 'Utilities',
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
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    )
  }
  return items
}

export default _nav
