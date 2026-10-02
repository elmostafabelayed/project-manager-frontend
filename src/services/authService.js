import api, { backendUrl } from './api'
import axios from 'axios'

const csrf = () => axios.get(`${backendUrl}/sanctum/csrf-cookie`, { withCredentials: true, withXSRFToken: true })

export const login    = async (data) => { await csrf(); return api.post('/login', data) }
export const register = async (data) => { await csrf(); return api.post('/register', data) }
export const logout   = ()     => api.post('/logout')
