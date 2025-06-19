"use client"

import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"

const SuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-800 rounded-full p-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Sent Successfully</h2>
        <p className="text-gray-600 mb-4">Access smarter wellness resources for a healthier you.</p>

        <div className="flex items-center justify-center flex-col ">
          <a
            href="http://www.smartshealth.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:underline text-2xl font-bold"
          >
            www.smartshealth.net
          </a>

          <button
            onClick={() => navigate("/results")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Go back to the results
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
