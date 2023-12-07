import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPrint } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CButton, CCol, CForm, CFormInput, CFormSelect, CModal, CRow } from '@coreui/react'
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
  cityMayor,
  commiteeChairperson,
} from 'src/components/DefaultValue'
import { decrypted } from 'src/components/Encrypt'
import HandleError from 'src/components/HandleError'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo-sm.png'
import { jwtDecode } from 'jwt-decode'

const Tvet = () => {
  const [data, setData] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [title, setTitle] = useState('')
  const [printPreviewModalVisible, setPrintPreviewModalVisible] = useState(false)
  const [user, setUser] = useState([])

  useEffect(() => {
    fetchSchool()
    setUser(jwtDecode(localStorage.getItem('oroqScholarshipToken')))
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

  const handlePrintData = () => {
    setPrintPreviewModalVisible(true)
  }

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontWeight: 'bolder',
      },
    ],
  })

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
      height: '100%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    country: {
      fontSize: '16pt',
    },
    office: {
      fontSize: '14pt',
    },
    city: {
      fontSize: '12pt',
    },
    citytag: {
      fontSize: '9pt',
      color: 'red',
      fontStyle: 'italic !important',
    },

    logo: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      left: 5,
    },

    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    description: {
      fontWeight: 'bolder',
      backgroundColor: '#5FBDFF',
      textAlign: 'center',
      marginBottom: '10px',
      fontSize: '12pt',
      paddingTop: '3px',
      paddingBottom: '3px',
    },
    table: {
      display: 'table',
      width: 'auto',
      autoShrink: true,
      marginBottom: 20,
      flexDirection: 'column',
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#bfbfbf',
      borderBottomWidth: 1,
    },
    tableHeader: {
      borderRight: 0.5,
      borderRightColor: '#bfbfbf',
      paddingTop: 5,
      paddingBottom: 5,
      flexGrow: 1,
      textAlign: 'center',
      fontWeight: 800,
      backgroundColor: 'blue',
      color: 'white',
      fontSize: '11pt',
      fontFamily: 'Roboto',
    },
    tableCell: {
      borderRight: 0.5,
      borderRightColor: '#bfbfbf',
      paddingTop: 3,
      paddingBottom: 3,
      flexGrow: 1,
      textAlign: 'center',
      flexWrap: 'wrap',
      wordWrap: 'break-word',
      fontSize: '10pt',
    },

    recommended: {
      fontSize: '11pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    chairpersion: {
      borderTop: 1,
      borderTopColor: 'black',
      width: 200,
      textAlign: 'center',
      marginLeft: 50,
      marginTop: 40,
      fontSize: '11pt',
      flexDirection: 'column',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    inBehalf: {
      flexDirection: 'row',
      fontSize: '10pt',
    },
    cityMayor: {
      textAlign: 'center',
      borderTop: 1,
      borderTopColor: 'black',
      flexDirection: 'column',
      marginLeft: 140,
      width: 180,
    },

    footer: {
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 20,
      textAlign: 'center',
      paddingTop: 10,
      fontSize: '8pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })

  const ROWS_PER_PAGE = 30
  const chunks = []

  for (let i = 0; i < data.length; i += ROWS_PER_PAGE) {
    chunks.push(data.slice(i, i + ROWS_PER_PAGE))
  }

  const totalChunks = chunks.length

  const maxWidths = {
    counter: 0,
    address: 0,
    name: 0,
    course: 0,
    year_level: 0,
    school: 0,
    contact: 0,
    availment: 0,
  }

  data.forEach((row) => {
    maxWidths.counter = Math.max(maxWidths.counter, `${row.index * ROWS_PER_PAGE + 1}`.length - 3)
    maxWidths.name = Math.max(
      maxWidths.name,
      `${row.colLastName}, ${row.colFirstName} ${row.colMI} ${row.colSuffix}`.length + 60,
    )
    maxWidths.address = Math.max(maxWidths.address, row.colAddress.length + 25)
    maxWidths.course = Math.max(maxWidths.course, row.colCourse.length)
    maxWidths.year_level = Math.max(maxWidths.year_level, row.colYearLevel.length + 10)
    maxWidths.school = Math.max(maxWidths.school, row.colSchool.length)
    maxWidths.contact = Math.max(maxWidths.contact, row.colContactNo.length)
    maxWidths.availment = Math.max(maxWidths.availment, row.colAvailment.length + 10)
  })

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
            enableColumnResizing
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
                  <CButton color="primary" variant="outline" onClick={handlePrintData} size="sm">
                    <FontAwesomeIcon icon={faPrint} /> Print
                  </CButton>
                </Box>
              </>
            )}
          />
          {loading && <DefaultLoading />}
        </CCol>
      </CRow>

      <CModal
        size="lg"
        alignment="center"
        visible={printPreviewModalVisible}
        onClose={() => setPrintPreviewModalVisible(false)}
      >
        <PDFViewer width="100%" height="800px%">
          <Document size="A4">
            {chunks.map((chunk, index) => (
              <Page key={index} style={styles.page}>
                <View style={styles.header}>
                  <Image src={logo} style={styles.logo} alt="logo" />
                  <Text style={styles.country}>Republic of the Philippines</Text>
                  <Text style={styles.office}>Office of the City Mayor</Text>
                  <Text style={styles.city}>Oroqueita City</Text>
                  <Text style={styles.citytag}>City of Goodlife</Text>
                </View>
                <View style={styles.description}>
                  <Text>{title}</Text>
                </View>
                <View></View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={{
                        ...styles.tableHeader,
                        width: `${maxWidths.counter}ch`,
                        borderLeft: 0.5,
                        borderLeftColor: '#bfbfbf',
                        fontWeight: 'bold',
                      }}
                    >
                      #
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.name}ch` }}>
                      Name
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.address}ch` }}>
                      Address
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.course}ch` }}>
                      Course
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.year_level}ch` }}>
                      Year Level
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.school}ch` }}>
                      School
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.contact}ch` }}>
                      Contact #
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.availment}ch` }}>
                      Availment
                    </Text>
                  </View>
                  {chunk.map((row, rowIndex) => (
                    <View style={styles.tableRow} key={rowIndex}>
                      <Text
                        style={{
                          ...styles.tableCell,
                          width: `${maxWidths.counter}ch`,
                          borderLeft: 0.5,
                          borderLeftColor: '#bfbfbf',
                        }}
                      >
                        {index * ROWS_PER_PAGE + rowIndex + 1}
                      </Text>
                      <Text
                        style={{
                          ...styles.tableCell,
                          width: `${maxWidths.name}ch`,
                          textAlign: 'left',
                        }}
                      >
                        {`${row.colLastName}, ${row.colFirstName} ${row.colMI} ${row.colSuffix}`}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.address}ch` }}>
                        {row.colAddress}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.course}ch` }}>
                        {row.colCourse}
                      </Text>

                      <Text style={{ ...styles.tableCell, width: `${maxWidths.year_level}ch` }}>
                        {row.colYearLevel}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.school}ch` }}>
                        {row.colSchool}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.contact}ch` }}>
                        {row.colContactNo}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.availment}ch` }}>
                        {row.colAvailment}
                      </Text>
                    </View>
                  ))}
                </View>

                <View>
                  {index === totalChunks - 1 && (
                    <>
                      <View style={styles.recommended}>
                        <Text>Recommended for Approval:</Text>
                        <Text style={{ marginRight: 180 }}>Approved:</Text>
                      </View>
                      <View style={styles.inBehalf}>
                        <Text>In behalf of the City Scholarship Screening Committee</Text>
                        <View style={styles.cityMayor}>
                          <Text>{cityMayor}</Text>
                          <Text style={{ textAlign: 'center', fontSize: 10 }}>City Mayor</Text>
                        </View>
                      </View>
                      <View style={styles.chairpersion}>
                        <Text>{commiteeChairperson}</Text>
                        <Text style={{ fontSize: 10 }}>Commitee Chairperson</Text>
                      </View>
                    </>
                  )}
                </View>

                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                  fixed
                />
                <View style={styles.footer}>
                  <Text>
                    Printed by: {`${user.firstname}  ${user.middlename}. ${user.lastname}`}
                  </Text>

                  <Text>Printed on: {new Date().toLocaleString()}</Text>
                </View>
              </Page>
            ))}
          </Document>
        </PDFViewer>
      </CModal>
    </>
  )
}

export default Tvet
