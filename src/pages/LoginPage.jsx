"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../features/auth/authSlice"
import { useSendOtpMutation } from "../features/auth/authApi"
import toast from "react-hot-toast"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!email) {
        throw new Error("Please enter your email address")
      }

      const response = await sendOtp(email).unwrap()
      console.log("OTP sent:", response)
      toast.success(response.message || "OTP sent successfully!")

      if (response.token) {
        dispatch(login({ user: { email }, token: response.token }))
      }

      navigate("/otp", { state: { email } })
    } catch (err) {
      setError(err?.data?.message || "Failed to send code")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl relative">
        <h1 className="text-2xl font-bold text-center mb-8">Hey there</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-start mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading || otpLoading}
          >
            {isLoading || otpLoading ? "Sending..." : "Send Code"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
