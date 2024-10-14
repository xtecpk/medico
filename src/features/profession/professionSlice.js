import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
}

export const professionSlice = createSlice({
  name: 'profession',
  initialState,
  reducers: {
    profession: (state, {payload}) => {
      state.value = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { profession } = professionSlice.actions

export default professionSlice.reducer