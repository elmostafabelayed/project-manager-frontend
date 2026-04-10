import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as proposalService from '../../pages/services/proposalService'

export const fetchMyProposals = createAsyncThunk(
  'proposals/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await proposalService.getMyProposals()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch proposals')
    }
  }
)

export const submitProposal = createAsyncThunk(
  'proposals/submit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await proposalService.submitProposal(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to submit proposal')
    }
  }
)

const proposalSlice = createSlice({
  name: 'proposals',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProposals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyProposals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMyProposals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(submitProposal.pending, (state) => {
        state.loading = true
      })
      .addCase(submitProposal.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(submitProposal.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default proposalSlice.reducer
