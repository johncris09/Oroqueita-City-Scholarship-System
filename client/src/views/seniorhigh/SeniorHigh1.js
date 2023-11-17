import ReactPaginate from 'react-paginate'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './../../assets/css/react-paginate.css'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { Hourglass, Oval } from 'react-loader-spinner'
import { Box, IconButton, Button, Paper, Tooltip, Typography } from '@mui/material'
import { Print } from '@mui/icons-material'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [currentPageData, setCurrentPageData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10 // Number of items per page

  const [loading, setLoading] = useState(true)
  const username = 'admin'
  const password = '1234'

  const axiosInstance = axios.create({
    baseURL: 'http://localhost/oroqscholar/api/', // Your API URL
    auth: {
      username,
      password,
    },
  })

  useEffect(() => {
    // Use Axios to fetch data from the API
    axiosInstance
      .get('seniorhigh')
      .then((response) => {
        console.log(response.data)
        setData(response.data) // Update the state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // The empty array means this effect runs once, similar to componentDidMount

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }
  useEffect(() => {
    const offset = currentPage * itemsPerPage
    setCurrentPageData(data.slice(offset, offset + itemsPerPage))
  }, [data, currentPage])

  const columns = [
    {
      accessorKey: 'AppFirstName',
      header: 'First Name',
    },
    {
      accessorKey: 'AppLastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'AppMidIn',
      header: 'Middle Name',
    },
    {
      accessorKey: 'AppStatus',
      header: 'Application Status',
    },
  ]

  return (
    <>
      <CRow>
        <CCol xs={12} style={{ position: 'relative' }}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Senior High</strong>
            </CCardHeader>
            <CCardBody>
              <>
                <MaterialReactTable
                  columns={columns}
                  components={{
                    Container: (props) => <Paper {...props} elevation={0} />,
                  }}
                  data={data}
                  enableColumnFilterModes
                  enableColumnOrdering
                  enableGrouping
                  enablePinning
                  enableColumnResizing
                  positionToolbarAlertBanner="bottom"
                  muiToolbarAlertBannerProps={() =>
                    true
                      ? {
                          color: 'error',
                          children: 'Network Error. Could not fetch data.',
                        }
                      : undefined
                  }
                  renderTopToolbarCustomActions={() => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                          alert('Create New Account')
                        }}
                      >
                        Create Account
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          alert('Delete Selected Accounts')
                        }}
                      >
                        Delete Selected Accounts
                      </Button>
                    </Box>
                  )}
                  enableStickyHeader
                  initialState={{ density: 'compact' }}
                  memoMode="rows"
                  muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
                />
              </>
            </CCardBody>
          </CCard>

          {loading && (
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
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default SeniorHigh
