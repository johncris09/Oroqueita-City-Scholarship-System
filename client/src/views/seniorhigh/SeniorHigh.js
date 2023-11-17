import ReactPaginate from 'react-paginate'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './../../assets/css/react-paginate.css'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const SeniorHigh = () => {
  const [data, setData] = useState([])
  const [currentPageData, setCurrentPageData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10 // Number of items per page

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
  }, [])

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }
  useEffect(() => {
    const offset = currentPage * itemsPerPage
    setCurrentPageData(data.slice(offset, offset + itemsPerPage))
  }, [data, currentPage])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Senior High</CCardHeader>
        <CCardBody>
          {Array.isArray(currentPageData) && currentPageData.length > 0 ? (
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Middle Name</th>
                  <th>Application Status</th>
                  {/* Add more table headers for other columns as needed */}
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr key={item.ID}>
                    <td>{item.AppFirstName}</td>
                    <td>{item.AppLastName}</td>
                    <td>{item.AppMidIn}</td>
                    <td>{item.AppStatus}</td>
                    {/* Add more table cells for other columns as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No data to display.</div>
          )}

          <ReactPaginate
            previousLabel="< "
            nextLabel=" >"
            className="pagination justify-content-end"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={Math.ceil(data.length / itemsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            activeClassName="active"
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default SeniorHigh
