import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBadge, CBreadcrumb, CBreadcrumbItem, CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'

const AppBreadcrumb = () => {
  const isProduction = false
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <CBreadcrumb className="m-0 ms-2">
        <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        })}
      </CBreadcrumb>
      <div className="float-end">
        <CBadge color={isProduction ? 'success ' : 'danger'} className="border border-light pb-2">
          <CSpinner size="sm" variant="grow" /> {isProduction ? 'Production ' : 'Development'}
        </CBadge>
      </div>
    </>
  )
}

export default React.memo(AppBreadcrumb)
