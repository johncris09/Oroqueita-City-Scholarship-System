import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CImage, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from './../assets/images/logo-sm.png'
import qrcore from './../assets/images/qrcode.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { InvalidTokenError, jwtDecode } from 'jwt-decode'
// sidebar nav config
import navigation from '../_nav'
import app from './../assets/app/Oroqscholarship.apk'
import QRCode from 'react-qr-code'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [user, setUser] = useState([])

  useEffect(() => {
    try {
      setUser(jwtDecode(localStorage.getItem('oroqScholarshipToken')))
      // Continue with the rest of your code if the token is valid
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        // Handle the specific error related to an invalid token
        console.error('Invalid token:', error.message)
      } else {
        // Handle other types of errors
        console.error('Unexpected error:', error.message)
      }
    }
  }, [])
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-md-flex" to="/">
        <CImage src={logo} height={100} className="mt-3 mb-1" />
      </CSidebarBrand>
      <CSidebarBrand className="d-md-flex" to="/">
        <p className="text-center h6">Oroquieta City Scholarship System</p>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation(user)} />
        </SimpleBar>
        <CSidebarBrand className="d-md-flex bg-white  " to="/">
          <div style={{ height: 'auto', margin: '0 auto', maxWidth: 100, width: '100%' }}>
            <QRCode
              size={200}
              style={{ height: 'auto', maxWidth: '100%', width: '100%', marginTop: 20 }}
              value={'https://oroquietacity.net/oroqscholarship' + app}
              viewBox={`0 0 256 256`}
            />
          </div>
        </CSidebarBrand>
        <CSidebarBrand className="d-md-flex bg-white" to="/">
          <p style={{ fontSize: 12, color: 'black' }} className="text-center">
            Scan QR to download the app or click
            <a href={app}> here.</a>
          </p>
        </CSidebarBrand>
      </CSidebarNav>

      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
