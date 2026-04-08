import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectReducer  from './slices/projectSlice'
import proposalReducer from './slices/proposalSlice'
import messageReducer  from './slices/messageSlice'
import reviewReducer   from './slices/reviewSlice'

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    projects: projectReducer,
    proposals:proposalReducer,
    messages: messageReducer,
    reviews:  reviewReducer,
  },
})