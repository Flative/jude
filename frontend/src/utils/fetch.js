import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://52.78.47.28/api/v1/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  get: (url) => axiosInstance(url, {
    method: 'GET',
  }),
  post: (url, data) => axiosInstance(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
