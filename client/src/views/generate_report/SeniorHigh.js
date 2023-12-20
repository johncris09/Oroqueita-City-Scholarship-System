import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { ExportToCsv } from 'export-to-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPrint } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import MaterialReactTable from 'material-react-table'
import { Box } from '@mui/material'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo-sm.png'
import { jwtDecode } from 'jwt-decode'
import {
  Address,
  DefaultLoading,
  GradeLevel,
  SchoolYear,
  Semester,
  Sex,
  StatusType,
  api,
  cityMayor,
  commiteeChairperson,
  decrypted,
  handleError,
  toSentenceCase,
} from 'src/components/Oroqscholarship'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [school, setSchool] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [fetchSchoolLoading, setFetchSchoolLoading] = useState(true)
  const [fetchStrandLoading, setFetchStrandLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [printPreviewModalVisible, setPrintPreviewModalVisible] = useState(false)
  const [user, setUser] = useState([])
  const [strand, setStrand] = useState([])

  useEffect(() => {
    fetchSchool()
    fetchStrand()
    setUser(jwtDecode(localStorage.getItem('oroqScholarshipToken')))
  }, [])

  const fetchSchool = () => {
    api
      .get('senior_high_school')
      .then((response) => {
        setSchool(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchSchoolLoading(false)
      })
  }

  const fetchStrand = () => {
    api
      .get('strand')
      .then((response) => {
        setStrand(decrypted(response.data))
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setFetchStrandLoading(false)
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
      grade_level: '',
      address: '',
      strand: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = [
        'school',
        'semester',
        'school_year',
        'status',
        'availment',
        'sex',
        'grade_level',
        'address',
        'strand',
      ]

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        return nonOptionalFields.includes(key) || !!values[key]
      })
      if (allNonOptionalFieldsNotEmpty) {
        setLoadingOperation(true)
        setLoading(true)
        await api
          .get('senior_high/generate_report/', { params: values })
          .then((response) => {
            let text = values.semester === '' ? '' : `${values.semester} Semester `
            text += `List of ${values.status} Senior High Scholarship Applicants `
            text += values.school_year === '' ? '' : `for ${values.school_year} `
            setTitle(text)
            setData(decrypted(response.data))
          })
          .catch((error) => {
            toast.error(handleError(error))
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
      accessorKey: 'AppNoID',
      header: 'Name',
      accessorFn: (row) =>
        `${toSentenceCase(row.AppLastName)}, ${toSentenceCase(row.AppFirstName)} ${toSentenceCase(
          row.AppMidIn,
        )}`,
    },
    {
      accessorKey: 'AppAddress',
      header: 'Address',
      accessorFn: (row) => `${toSentenceCase(row.AppAddress)}`,
    },
    {
      accessorKey: 'AppCourse',
      header: 'Strand',
    },
    {
      accessorKey: 'AppYear',
      header: 'Grade Level',
    },
    {
      accessorKey: 'AppSchool',
      header: 'School',
    },
    {
      accessorKey: 'AppContact',
      header: 'Contact #',
    },
    {
      accessorKey: 'AppAvailment',
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
        Name: `${item.AppLastName}, ${item.AppFirstName} ${item.AppMidIn}`,
        Address: item.AppAddress,
        Strand: item.AppCourse,
        'Grade Level': item.AppYear,
        School: item.AppSchool,
        'Contact #': item.AppContact,
        Availment: item.AppAvailment,
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
      color: 'grey',
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
    grade_level: 0,
    school: 0,
    ctc_number: 0,
    availment: 0,
  }

  data.forEach((row) => {
    maxWidths.counter = Math.max(maxWidths.counter, `${row.index * ROWS_PER_PAGE + 1}`.length - 3)
    maxWidths.name = Math.max(
      maxWidths.name,
      `${row.AppLastName}, ${row.AppFirstName} ${row.AppMidIn} ${row.AppSuffix}`.length + 60,
    )
    maxWidths.address = Math.max(maxWidths.address, row.AppAddress.length + 25)
    maxWidths.course = Math.max(maxWidths.course, row.AppCourse.length)
    maxWidths.grade_level = Math.max(maxWidths.grade_level, row.AppYear.length)
    maxWidths.school = Math.max(maxWidths.school, row.AppSchool.length)
    maxWidths.ctc_number = Math.max(maxWidths.ctc_number, row.AppCTC.length)
    maxWidths.availment = Math.max(maxWidths.availment, row.AppAvailment.length)
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
                  label={
                    <>
                      {fetchSchoolLoading && <CSpinner size="sm" />}
                      {' School'}
                    </>
                  }
                  name="school"
                  onChange={handleInputChange}
                  value={form.values.school}
                >
                  <option value="">Select</option>
                  {school.map((school, index) => (
                    <option key={index} value={school.SchoolName}>
                      {school.SchoolName}
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
                  label="Grade Level"
                  name="grade_level"
                  onChange={handleInputChange}
                  value={form.values.grade_level}
                >
                  <option value="">Select</option>
                  {GradeLevel.map((grade_level, index) => (
                    <option key={index} value={grade_level}>
                      {grade_level}
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

            <CRow>
              <CCol md={12}>
                <CFormSelect
                  label={
                    <>
                      {fetchStrandLoading && <CSpinner size="sm" />}
                      {' Strand'}
                    </>
                  }
                  name="strand"
                  onChange={handleInputChange}
                  value={form.values.strand}
                >
                  <option value="">Select</option>
                  {strand.map((strand, index) => (
                    <option key={index} value={strand.Strand}>
                      {strand.Strand}
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
          <Document
            size="A4"
            author={process.env.REACT_APP_DEVELOPER}
            title="Senior High Applicants"
            keywords="document, pdf"
            subject={title}
            creator={process.env.REACT_APP_DEVELOPER}
            producer={process.env.REACT_APP_DEVELOPER}
            pdfVersion="1.3"
          >
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
                      No.
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.name}ch` }}>
                      Name
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.address}ch` }}>
                      Address
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.course}ch` }}>
                      Strand
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.grade_level}ch` }}>
                      Grade Level
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.school}ch` }}>
                      School
                    </Text>
                    <Text style={{ ...styles.tableHeader, width: `${maxWidths.ctc_number}ch` }}>
                      CTC No.
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
                        {`${row.AppLastName}, ${row.AppFirstName} ${row.AppMidIn} ${row.AppSuffix}`}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.address}ch` }}>
                        {row.AppAddress}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.course}ch` }}>
                        {row.AppCourse}
                      </Text>

                      <Text style={{ ...styles.tableCell, width: `${maxWidths.grade_level}ch` }}>
                        {row.AppYear}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.school}ch` }}>
                        {row.AppSchool}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.ctc_number}ch` }}>
                        {row.AppCTC}
                      </Text>
                      <Text style={{ ...styles.tableCell, width: `${maxWidths.availment}ch` }}>
                        {row.AppAvailment}
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

export default SeniorHigh
