import axios from 'axios'

const api = axios.create({ 
  baseURL: 'http://localhost/oroqscholar/api/',

  auth: {
    username: __USERNAME__,
    password: __PASSWORD__, 
  },
})

export default api
