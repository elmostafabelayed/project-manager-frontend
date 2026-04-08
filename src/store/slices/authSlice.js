import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login, register, logout } from '../../services/authService'

// ── Thunks ──────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await login(credentials)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await register(userData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Register failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout()
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

// ── Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    JSON.parse(localStorage.getItem('user'))  || null,
    token:   localStorage.getItem('token') || null,
    role:    localStorage.getItem('role')  || null,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        state.role    = String(action.payload.user.role_id)
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('role',  action.payload.user.role_id)
        localStorage.setItem('user',  JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        state.role    = String(action.payload.user.role_id)
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('role',  action.payload.user.role_id)
        localStorage.setItem('user',  JSON.stringify(action.payload.user))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // ── Logout ──
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user  = null
        state.token = null
        state.role  = null
        localStorage.clear()
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
