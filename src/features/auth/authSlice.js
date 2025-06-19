import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  surveyData: null,
  recommendations: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.surveyData = null
      state.recommendations = null
    },
    saveSurveyData: (state, action) => {
      state.surveyData = action.payload
    },
    saveRecommendations: (state, action) => {
      state.recommendations = action.payload
    },
  },
})

export const { login, logout, saveSurveyData, saveRecommendations } = authSlice.actions
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectSurveyData = (state) => state.auth.surveyData
export const selectRecommendations = (state) => state.auth.recommendations
export default authSlice.reducer
