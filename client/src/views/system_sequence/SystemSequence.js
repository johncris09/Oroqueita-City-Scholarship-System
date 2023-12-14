import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { ListItemIcon, MenuItem } from '@mui/material'
import { EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  api,
  decrypted,
  handleError,
  requiredField,
  toSentenceCase,
} from 'src/components/Oroqscholarship'

const SystemSequence = () => {
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)

  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('system_sequence')
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const form = useFormik({
    initialValues: {
      seq_appno: '',
      seq_name: '',
      seq_sem: '',
      seq_year: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        // setOperationLoading(true)
        if (isEnableEdit) {
          // update
          setFetchDataLoading(true)
          await api
            .put('system_sequence/update/' + editId, values)
            .then((response) => {
              toast.success(response.data.message)
              fetchData()
              setValidated(false)
              setModalFormVisible(false)
            })
            .catch((error) => {
              console.info(error)
              // toast.error(handleError(error))
            })
            .finally(() => {
              setOperationLoading(false)
              setFetchDataLoading(false)
            })
        }
      } else {
        toast.warning('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text' && name !== 'username') {
      form.setFieldValue(name, toSentenceCase(value))
    } else {
      form.setFieldValue(name, value)
    }
  }

  const column = [
    {
      accessorKey: 'seq_name',
      header: 'Sequence Name',
    },

    {
      accessorKey: 'seq_year',
      header: '  Year',
    },

    {
      accessorKey: 'seq_sem',
      header: '  Semester',
    },
    {
      accessorKey: 'seq_appno',
      header: 'Application #',
    },
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>System Sequence</CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
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
            data={data}
            enableRowVirtualization
            enableColumnVirtualization
            enableGrouping
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()
                  let id = row.original.Sys_ID
                  setIsEnableEdit(true)
                  setEditId(id)
                  setFetchDataLoading(true)
                  setOperationLoading(true)
                  await api
                    .get('system_sequence/find/' + id)
                    .then((response) => {
                      const res = decrypted(response.data)

                      form.setValues({
                        seq_appno: res.seq_appno,
                        seq_name: res.seq_name,
                        seq_sem: res.seq_sem,
                        seq_year: res.seq_year,
                      })
                      setModalFormVisible(true)
                    })
                    .catch((error) => {
                      toast.error('Error fetching data')
                    })
                    .finally(() => {
                      setOperationLoading(false)
                      setFetchDataLoading(false)
                    })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <EditSharp />
                </ListItemIcon>
                Edit
              </MenuItem>,
            ]}
          />

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalFormVisible}
        onClose={() => setModalFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {isEnableEdit ? 'Edit System Sequence' : 'Add New  System Sequence'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <requiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            noValidate
            validated={validated}
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="Sequence Name is required."
                label={requiredField('Sequence Name')}
                name="seq_name"
                onChange={handleInputChange}
                value={form.values.seq_name}
                required
                placeholder="Sequence Name"
              />
              <CFormInput
                type="text"
                feedbackInvalid="Sequence Year is required."
                label={requiredField('Sequence Year')}
                name="seq_year"
                onChange={handleInputChange}
                value={form.values.seq_year}
                required
                placeholder="Sequence Year"
              />
              <CFormInput
                type="text"
                feedbackInvalid="Sequence Semester is required."
                label={requiredField('Sequence Semester')}
                name="seq_sem"
                onChange={handleInputChange}
                value={form.values.seq_sem}
                required
                placeholder="Sequence Semester"
              />
              <CFormInput
                type="text"
                feedbackInvalid="Sequence Application # is required."
                label={requiredField('Sequence Application #')}
                name="seq_appno"
                onChange={handleInputChange}
                value={form.values.seq_appno}
                required
                placeholder="Sequence Application #"
              />
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit form'}
              </CButton>
            </CCol>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default SystemSequence
