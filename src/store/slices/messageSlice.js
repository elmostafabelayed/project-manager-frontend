import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
})

export default messageSlice.reducer
