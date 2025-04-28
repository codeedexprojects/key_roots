import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.VITE_API_BASE_URL,
  withCredentials: true,
});

const devToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4ODAxMjg0LCJpYXQiOjE3NDU4NDEyODQsImp0aSI6ImY4NjJlYmI2NGZkNjQwNmVhYWFlOWI0ZTNkNDY1NTg0IiwidXNlcl9pZCI6MX0.pNk7UCPtY1w2miY-JWldp3uSjTtju0BQDRkpu2Hn9VA'; // paste your JWT token here

if (devToken) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
}
