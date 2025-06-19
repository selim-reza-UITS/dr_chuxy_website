import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import OTPPage from "./pages/OTPPage"
import SurveyPage from "./pages/SurveyPage"
import ResultsPage from "./pages/ResultsPage"
import EmailResultsPage from "./pages/EmailResultsPage"
import SuccessPage from "./pages/SuccessPage"
import { PrivateRoute } from "./private/PrivateRoute"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OTPPage />} />

      {/* Protected routes - only accessible after authentication */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <SurveyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/results"
        element={
          <PrivateRoute>
            <ResultsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/email-results"
        element={
          <PrivateRoute>
            <EmailResultsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PrivateRoute>
            <SuccessPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
