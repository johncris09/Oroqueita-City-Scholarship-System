import axios from 'axios'
const isDevelopment = true
const api = axios.create({
  baseURL: isDevelopment
    ? process.env.REACT_APP_BASEURL_DEVELOPMENT
    : process.env.REACT_APP_BASEURL_PRODUCTION,

  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
})

export default api
