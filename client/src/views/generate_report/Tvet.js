import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box } from '@mui/material'
import api from 'src/components/Api'
import { DefaultLoading } from 'src/components/Loading'
import {
  Address,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  YearLevel,
} from 'src/components/DefaultValue'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'

const Tvet = () => {
  const [data, setData] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchSchool()
  }, [])

  const fetchSchool = () => {
    api
      .get('college_school')
      .then((response) => {
        setSchool(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const form = useFormik({
    initialValues: {
      school: '',
      semester: '',
      school_year: '',
      status: '',
      availment: '',
      sex: '',
      year_level: '',
      address: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = [
        'school',
        'semester',
        'school_year',
        'status',
        'availment',
        'sex',
        'year_level',
        'address',
      ]

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        // Check if the field is non-optional and not empty
        return nonOptionalFields.includes(key) || !!values[key]
      })
      if (allNonOptionalFieldsNotEmpty) {
        setLoadingOperation(true)
        setLoading(true)
        await api
          .get('tvet/generate_report/', { params: values })
          .then((response) => {
            let text = values.semester === '' ? '' : `${values.semester} Semester `
            text += `List of ${values.status} TVET Scholarship Applicants `
            text += values.school_year === '' ? '' : `for ${values.school_year} `
            setTitle(text)
            setData(decrypted(response.data))
          })
          .catch((error) => {
            toast.error(HandleError(error))
          })
          .finally(() => {
            setLoadingOperation(false)
            setLoading(false)
          })
      }
    },
  })

  const column = [
    {
      accessorKey: 'colAppNoID',
      header: 'Name',
      accessorFn: (row) => `${row.colLastName}, ${row.colFirstName} ${row.colMI}`,
    },
    {
      accessorKey: 'colAddress',
      header: 'Address',
    },
    {
      accessorKey: 'colCourse',
      header: 'Strand',
    },
    {
      accessorKey: 'colYearLevel',
      header: 'Year Level',
    },
    {
      accessorKey: 'colSchool',
      header: 'School',
    },
    {
      accessorKey: 'colContactNo',
      header: 'Contact #',
    },
    {
      accessorKey: 'colAvailment',
      header: 'Availment',
    },
  ]

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }
  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        Name: `${item.colLastName}, ${item.colFirstName} ${item.colMI}`,
        Address: item.colAddress,
        Strand: item.colCourse,
        'Year Level': item.colYearLevel,
        School: item.colSchool,
        'Contact #': item.colContactNo,
        Availment: item.colAvailment,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol>
          <CForm
            className="row g-3 needs-validation my-4"
            noValidate
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CRow>
              <CCol md={12}>
                <CFormSelect
                  label="School"
                  name="school"
                  onChange={handleInputChange}
                  value={form.values.school}
                >
                  <option value="">Select</option>
                  {school.map((school, index) => (
                    <option key={index} value={school.colSchoolName}>
                      {school.colSchoolName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <CFormSelect
                  label="Semester"
                  name="semester"
                  onChange={handleInputChange}
                  value={form.values.semester}
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

              <CCol md={4}>
                <CFormSelect
                  label="School Year"
                  name="school_year"
                  onChange={handleInputChange}
                  value={form.values.school_year}
                >
                  <option value="">Select</option>
                  {SchoolYear.map((school_year, index) => (
                    <option key={index} value={school_year}>
                      {school_year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  aria-label="Status"
                  label="Status"
                  name="status"
                  onChange={handleInputChange}
                  value={form.values.status}
                >
                  <option value="">Select</option>
                  {StatusType.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Availment"
                  name="availment"
                  onChange={handleInputChange}
                  value={form.values.availment}
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  type="text"
                  label="Sex"
                  name="sex"
                  onChange={handleInputChange}
                  value={form.values.sex}
                >
                  <option value="">Select</option>
                  {Sex.map((sex, index) => (
                    <option key={index} value={sex}>
                      {sex}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label="Year Level"
                  name="year_level"
                  onChange={handleInputChange}
                  value={form.values.year_level}
                  required
                >
                  <option value="">Select</option>
                  {YearLevel.map((year_level, index) => (
                    <option key={index} value={year_level}>
                      {year_level}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={12}>
                <CFormSelect
                  aria-label="Address"
                  label="Address"
                  name="address"
                  onChange={handleInputChange}
                  value={form.values.address}
                >
                  <option value="">Select</option>
                  {Address.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="justify-content-between mt-4">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  Generate
                </CButton>
              </div>
              {loadingOperation && <DefaultLoading />}
            </CRow>
          </CForm>
        </CCol>
      </CRow>
      <CRow>
        <CCol style={{ position: 'relative' }}>
          <div className="text-center">
            <p className="h6">{title}</p>
          </div>
          <MaterialReactTable
            columns={column}
            data={data}
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
            enableGrouping
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderTopToolbarCustomActions={({ table }) => (
              <>
                <Box
                  className="d-none d-lg-flex"
                  sx={{
                    display: 'flex',
                    gap: '.2rem',
                    p: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                </Box>
              </>
            )}
          />
          {loading && <DefaultLoading />}
        </CCol>
      </CRow>
    </>
  )
}

export default Tvet
