import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 'en',
}

export const lanSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    language: (state, {payload}) => {
      state.value = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { language } = lanSlice.actions

export default lanSlice.reducer