import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
} from '@coreui/react'
import api from 'src/components/Api'
import MaterialReactTable from 'material-react-table'
import { DefaultLoading } from 'src/components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { Box } from '@mui/material'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'
import { ToastContainer, toast } from 'react-toastify'

const Dashboard = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultText, setResultText] = useState('')

  useEffect(() => {}, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    searchForm.setFieldValue(name, value)
  }

  const searchForm = useFormik({
    initialValues: {
      query: '',
    },
    onSubmit: async (values) => {
      if (values.query) {
        setLoading(true)
        await api
          .post('search/find', values)
          .then((response) => {
            setData(decrypted(response.data))
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoading(false)
          })
        setResultText('Result for ' + values.query)
      } else {
        setLoading(false)
        setData([])
        setResultText('')
      }
    },
  })

  const column = [
    {
      accessorKey: 'id',
      header: 'Application #',
      accessorFn: (row) => `${row.appnoyear}-${row.appnosem}-${row.appnoid}`,
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
      accessorKey: 'lastname',
      header: 'Last Name',
    },
    {
      accessorKey: 'firstname',
      header: 'First Name',
    },
    {
      accessorKey: 'middlename',
      header: 'M.I.',
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact #',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'school',
      header: 'School',
    },
    {
      accessorKey: 'course',
      header: 'Strand',
    },
    {
      accessorKey: 'school_year',
      header: 'School Year',
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
    },

    {
      accessorKey: 'status',
      header: 'Application Status',
    },
    {
      accessorKey: 'scholarship',
      header: 'Scholarship',
    },
  ]
  return (
    <>
      <ToastContainer />
      <CRow className="mb-3">
        <CCol md={12}>
          <CCard>
            <CCardHeader>Advance Search</CCardHeader>
            <CCardBody>
              <CForm
                id="searchForm"
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={searchForm.handleSubmit}
              >
                <CRow className="mt-4 mb-2 justify-content-center ">
                  <CCol md={8}>
                    <CInputGroup>
                      <CFormInput
                        name="query"
                        onChange={handleInputChange}
                        value={searchForm.values.query}
                        placeholder="Search name then press enter..."
                        aria-describedby="label-search"
                      />
                      <CButton type="submit" color="primary" variant="outline" id="label-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>{resultText}</CCardHeader>
            <CCardBody style={{ position: 'relative' }}>
              <MaterialReactTable
                columns={column}
                state={{
                  isLoading: loading,
                  isSaving: loading,
                  showLoadingOverlay: loading,
                  showProgressBars: loading,
                  showSkeletons: loading,
                }}
                muiCircularProgressProps={{
                  color: 'secondary',
                  thickness: 5,
                  size: 55,
                }}
                muiSkeletonProps={{
                  animation: 'pulse',
                  height: 28,
                }}
                data={data}
                columnFilterDisplayMode="popover"
                paginationDisplayMode="pages"
                positionToolbarAlertBanner="bottom"
                enableStickyHeader
                enableStickyFooter
                selectAllMode="all"
                initialState={{ density: 'compact' }}
              />
            </CCardBody>

            {loading && <DefaultLoading />}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
