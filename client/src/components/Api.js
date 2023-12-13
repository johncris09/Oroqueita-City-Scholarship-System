import axios from 'axios'
const isProduction = false
const api = axios.create({
  baseURL: isProduction
    ? process.env.REACT_APP_BASEURL_PRODUCTION
    : process.env.REACT_APP_BASEURL_DEVELOPMENT,

  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
})

export default api
