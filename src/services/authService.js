import api from './api'
import axios from 'axios'

const csrf = () => axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true, withXSRFToken: true })

export const login    = async (data) => { await csrf(); return api.post('/login', data) }
export const register = async (data) => { await csrf(); return api.post('/register', data) }
export const logout   = ()     => api.post('/logout')
