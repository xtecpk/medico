import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
}

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    service: (state, {payload}) => {
      state.value = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { service } = serviceSlice.actions

export default serviceSlice.reducer