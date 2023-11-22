import React, { useState, useEffect } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CRow,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import api from 'src/components/Api'
import MaterialReactTable from 'material-react-table'
import { DefaultLoading, WidgetLoading } from 'src/components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { RequiredField, RequiredFieldNote } from 'src/components/RequiredField'
import { SchoolYear, Semester } from 'src/components/DefaultValue'
import { decrypted } from 'src/components/Encrypt'

const Dashboard = () => {
  const [loadingTotal, setLoadingTotal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalStatusData, setTotalStatusData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)

  useEffect(() => {
    fetchTotalStatus()
    fetchTotal()
  }, [])

  const fetchTotalStatus = () => {
    setLoading(true)
    Promise.all([
      api.get('senior_high/total_status'),
      api.get('college/total_status'),
      api.get('tvet/total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => decrypted(response.data))
        setTotalStatusData(newData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotal = () => {
    setLoadingTotal(true)
    Promise.all([api.get('senior_high/total'), api.get('college/total'), api.get('tvet/total')])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: decrypted(response[0]),
          college: decrypted(response[1]),
          tvet: decrypted(response[2]),
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })
  }

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingOperation(true)
    filterForm.resetForm()
    fetchTotal()
    fetchTotalStatus()
  }

  const handleViewAllData = () => {
    setLoadingTotal(true)
    setLoadingOperation(true)

    filterForm.resetForm()
    setValidated(false)

    Promise.all([
      api.get('senior_high/all_total_status'),
      api.get('college/all_total_status'),
      api.get('tvet/all_total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => decrypted(response.data))
        setTotalStatusData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total status data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })

    // Fetch total data
    Promise.all([
      api.get('senior_high/all_total'),
      api.get('college/all_total'),
      api.get('tvet/all_total'),
    ])
      .then((responses) => {
        const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
          (response) => response.data,
        )
        const newData = {
          senior_high: decrypted(responseSeniorHigh),
          college: decrypted(responseCollege),
          tvet: decrypted(responseTvet),
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
  }

  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoadingTotal(true)
        setLoadingOperation(true)
        // Fetch total status data
        Promise.all([
          api.post('senior_high/filter_total_status', values),
          api.post('college/filter_total_status', values),
          api.post('tvet/filter_total_status', values),
        ])
          .then((responses) => {
            const newData = responses.map((response) => decrypted(response.data))
            setTotalStatusData(newData)
          })
          .catch((error) => {
            console.error('Error fetching total status data:', error)
          })
          .finally(() => {
            setLoadingTotal(false)
            setLoadingOperation(false)
          })

        // Fetch total data
        Promise.all([
          api.post('senior_high/filter_total', values),
          api.post('college/filter_total', values),
          api.post('tvet/filter_total', values),
        ])
          .then((responses) => {
            const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
              (response) => response.data,
            )
            const newData = {
              senior_high: decrypted(responseSeniorHigh),
              college: decrypted(responseCollege),
              tvet: decrypted(responseTvet),
            }
            setTotalData(newData)
          })
          .catch((error) => {
            console.error('Error fetching total data:', error)
          })
          .finally(() => {
            setLoadingTotal(false)
            setLoadingOperation(false)
          })
      } else {
        console.warn('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const column = [
    {
      accessorKey: 'type',
      header: 'Scholarship Type',
    },
    {
      accessorKey: 'approved',
      header: 'Approved',
    },
    {
      accessorKey: 'pending',
      header: 'Pending',
    },
    {
      accessorKey: 'disapproved',
      header: 'Dispproved',
    },
    {
      accessorKey: 'archived',
      header: 'Archived',
    },
    {
      accessorKey: 'void',
      header: 'Void',
    },
  ]

  return (
    <>
      <CRow className="justify-content-center ">
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>Dashboard</CCardHeader>
            <CCardBody>
              <h5>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </h5>
              <CForm
                id="filterForm"
                className="row g-3 needs-validation mb-4"
                noValidate
                validated={validated}
                onSubmit={filterForm.handleSubmit}
              >
                <RequiredFieldNote />

                <CRow className="my-1">
                  <CCol md={6}>
                    <CFormSelect
                      feedbackInvalid="Semester is required."
                      label={RequiredField('Semester')}
                      name="semester"
                      onChange={handleInputChange}
                      value={filterForm.values.semester}
                      required
                    >
                      <option value="">Select</option>
                      {Semester.map((semester, index) => (
                        <option key={index} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormSelect
                      feedbackInvalid="School Year is required."
                      label={RequiredField('School Year')}
                      name="school_year"
                      onChange={handleInputChange}
                      value={filterForm.values.school_year}
                      required
                    >
                      <option value="">Select</option>
                      {SchoolYear.map((school_year, index) => (
                        <option key={index} value={school_year}>
                          {school_year}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="justify-content-between mt-1">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFilter}
                    >
                      <FontAwesomeIcon icon={faCancel} /> Remove Filter
                    </CButton>
                    <CButton
                      size="sm"
                      variant="outline"
                      color="primary"
                      onClick={handleViewAllData}
                    >
                      <FontAwesomeIcon icon={faEye} /> View All Data
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                      <FontAwesomeIcon icon={faFilter} /> Filter
                    </CButton>
                  </div>
                </CRow>
              </CForm>

              {loadingOperation && <DefaultLoading />}
              <hr />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3  "
            variant="outline"
            color="primary"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="Senior High"
            value={totalData.senior_high}
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="College"
            value={totalData.college}
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="TVET"
            value={totalData.tvet}
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
      </CRow>
      <CRow>
        <CCol style={{ position: 'relative' }}>
          <MaterialReactTable
            columns={column}
            data={totalStatusData}
            enableRowVirtualization
            enableColumnVirtualization
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
            enableFullScreenToggle={false}
            enableHiding={false}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableGrouping={false}
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            selectAllMode="all"
            initialState={{ density: 'compact' }}
          />
          {loadingTotal && <DefaultLoading />}
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
