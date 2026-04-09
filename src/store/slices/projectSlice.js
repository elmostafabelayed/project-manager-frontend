import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as projectService from '../../pages/services/projectService'

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await projectService.getProjects()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch projects')
    }
  }
)

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const res = await projectService.createProject(projectData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create project')
    }
  }
)

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default projectSlice.reducer
