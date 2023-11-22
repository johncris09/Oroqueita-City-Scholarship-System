import React from 'react'
const HandleError = (error) => {
  let errorMessage

  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Resource not found. Please check the URL!'
      break
    case 'ERR_BAD_RESPONSE':
      errorMessage = 'Internal Server Error. Please try again later.'
      break
    case 'ERR_NETWORK':
      errorMessage = 'Please check your internet connection and try again!'
      break
    case 'ECONNABORTED':
      errorMessage = 'The request timed out. Please try again later.'
      break
    case 'ERR_SERVER':
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Internal Server Error. Please try again later.'
        } else if (error.response.status === 404) {
          errorMessage = 'Resource not found. Please check the URL.'
        } else if (error.response.status === 403) {
          errorMessage = 'Access forbidden. Please check your permissions.'
        } else {
          errorMessage = `Unexpected server error: ${error.response.status}`
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      break
    case 'ERR_CLIENT':
      if (error.response && error.response.status === 400) {
        errorMessage = 'Bad request. Please check your input.'
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.'
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else {
        errorMessage = 'Client error. Please check your request.'
      }
      break
    default:
      console.error('An error occurred:', error)
      errorMessage = 'An unexpected error occurred. Please try again.'
      break
  }

  return errorMessage
}

export default HandleError
