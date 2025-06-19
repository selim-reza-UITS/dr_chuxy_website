"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useGetQuestionsQuery, useSubmitSurveyResponseMutation } from "../features/auth/surveryApi"
import { saveSurveyData, saveRecommendations } from "../features/auth/authSlice"

const SurveyPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // API hooks
  const { data: questionsData, isLoading: questionsLoading, error: questionsError } = useGetQuestionsQuery()
  const [submitSurveyResponse, { isLoading: isSubmitting }] = useSubmitSurveyResponseMutation()

  // Group questions into pages (5 questions per page)
  const questionGroups = questionsData
    ? (() => {
        const groupSize = 5
        const groups = []
        for (let i = 0; i < questionsData.length; i += groupSize) {
          groups.push(questionsData.slice(i, i + groupSize))
        }
        return groups
      })()
    : []

  const totalPages = questionGroups.length

  // Handle input changes
  const handleChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }))
    setErrors((prev) => ({ ...prev, [questionId]: null }))
  }

  // Validate current page
  const validatePage = () => {
    if (!questionGroups[currentPage]) return false

    const currentQuestions = questionGroups[currentPage]
    const newErrors = {}
    let isValid = true

    currentQuestions.forEach((q) => {
      if (!formData[q.id] || formData[q.id].trim() === "") {
        newErrors[q.id] = "This field is required"
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Handle next page
  const handleNext = () => {
    if (validatePage()) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validatePage()) return

    try {
      // Transform form data to match API format
      const responseFormData = Object.entries(formData).map(([questionId, responseText]) => {
        const question = questionsData.find((q) => q.id === Number.parseInt(questionId))
        return {
          question: question?.title || "",
          response_text: responseText,
        }
      })

      const result = await submitSurveyResponse(responseFormData).unwrap()

      // Save data to Redux store
      dispatch(saveSurveyData(formData))
      if (result.ai_response) {
        dispatch(saveRecommendations(result.ai_response))
      }

      navigate("/results")
    } catch (error) {
      console.error("Error submitting survey:", error)
      alert("Failed to submit survey. Please try again.")
    }
  }

  // Loading state
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading survey questions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (questionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 mb-4">Failed to load survey questions</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No questions available
  if (!questionGroups.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-600">No survey questions available</p>
        </div>
      </div>
    )
  }

  const currentQuestions = questionGroups[currentPage]
  const progress = ((currentPage + 1) / totalPages) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">Health Survey</h1>
        <p className="text-gray-500 text-center mb-8">
          Answer the questions below for personalized health recommendations
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-left">{question.title}</label>

              {question.input_type === "text" && (
                <div>
                  <input
                    type="text"
                    placeholder={question.placeholder || "Enter your answer"}
                    value={formData[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className={`w-full p-3 border ${errors[question.id] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                  />
                  {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>}
                </div>
              )}

              {question.input_type === "select" && (
                <div>
                  <select
                    value={formData[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className={`w-full p-3 border ${errors[question.id] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {question.choices &&
                      question.choices.map((choice, index) => (
                        <option key={index} value={choice.option_text}>
                          {choice.option_text}
                        </option>
                      ))}
                  </select>
                  {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-10">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
            )}

            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ml-auto"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SurveyPage
