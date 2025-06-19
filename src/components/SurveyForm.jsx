

import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Mock questions data (would come from backend in real implementation)
const mockQuestions = [
  {
    id: 1,
    question: "Name",
    type: "text",
    placeholder: "Type your full name",
  },
  {
    id: 2,
    question: "Age",
    type: "text",
    placeholder: "Type your age",
  },
  {
    id: 3,
    question: "Gender",
    type: "select",
    options: ["Male", "Female", "Other", "Prefer not to say"],
  },
  {
    id: 4,
    question: "Zip Code",
    type: "text",
    placeholder: "Type your zip code",
  },
  {
    id: 5,
    question: "Nicotine Exposure",
    type: "select",
    options: ["Never smoker", "Former smoker", "Current smoker", "Exposed to secondhand smoke"],
  },
  {
    id: 6,
    question: "Physical Activity",
    type: "select",
    options: ["0-1 days per week", "2-3 days per week", "4-5 days per week", "6-7 days per week"],
  },
  {
    id: 7,
    question: "Hours of Sleep on Average",
    type: "select",
    options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"],
  },
  {
    id: 8,
    question: "Fruit and Vegetable Intake",
    type: "select",
    options: ["0-1 servings", "2-3 servings", "4-5 servings", "More than 5 servings"],
  },
  {
    id: 9,
    question: "Consumption of Processed Foods",
    type: "select",
    options: ["Daily", "2-3 times a week", "1-2 times a week", "Rarely or never"],
  },
  {
    id: 10,
    question: "Hypertension Screen - When was the last time a healthcare professional checked your blood pressure?",
    type: "select",
    options: ["Less than 6 months ago", "6-12 months ago", "More than 12 months ago", "Never"],
  },
  {
    id: 11,
    question: "Last Blood Pressure Range",
    type: "select",
    options: ["Less than 120/80", "120-139/80-89", "More than 140/90", "Not Sure"],
  },
  {
    id: 12,
    question: "Do you take medications for hypertension?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: 13,
    question: "Do you know what a normal blood pressure is?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: 14,
    question: "When was the last time you had blood work to screen for diabetes or hyperlipidemia?",
    type: "select",
    options: ["Less than 6 months ago", "6-12 months ago", "More than 12 months ago", "Never"],
  },
  {
    id: 15,
    question: "BMI",
    type: "select",
    options: ["Less than 25", "25-30", "30-35", "More than 35", "Not sure"],
  },
]

const SurveyForm = () => {
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const questionsPerPage = 5
  const totalPages = Math.ceil(mockQuestions.length / questionsPerPage)

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would send data to the backend
    console.log("Form submitted:", formData)

    // Navigate to response page with form data
    navigate("/response", { state: { formData } })
  }

  const nextPage = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevPage = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Get current questions
  const currentQuestions = mockQuestions.slice(currentStep * questionsPerPage, (currentStep + 1) * questionsPerPage)

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Health Related Survey</h1>
      <p className="text-gray-600 text-center mb-6">Personalized health recommendations</p>

      <form onSubmit={handleSubmit}>
        {currentQuestions.map((q) => (
          <div key={q.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-start">{q.question}</label>

            {q.type === "text" && (
              <input
                type="text"
                placeholder={q.placeholder}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === "select" && (
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevPage}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}

          {currentStep < totalPages - 1 ? (
            <button
              type="button"
              onClick={nextPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto">
              Submit
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Page {currentStep + 1} of {totalPages}
        </div>
      </form>
    </div>
  )
}

export default SurveyForm
