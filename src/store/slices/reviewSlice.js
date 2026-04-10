import { createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
})

export default reviewSlice.reducer
