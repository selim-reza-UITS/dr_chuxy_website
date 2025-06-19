"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../features/auth/authSlice"
import { useVerifyOtpMutation } from "../features/auth/authApi"

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const [verifyOtp] = useVerifyOtpMutation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!email) {
      navigate("/login")
      return
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const otpValue = otp.join("")

    try {
      const response = await verifyOtp({ email, otp: otpValue }).unwrap()

      if (response.access) {
        dispatch(
          login({
            user: { email, username: response.user.username },
            token: response.access,
          }),
        )
        navigate("/")
      } else {
        setError("Invalid OTP or server error")
      }
    } catch (err) {
      setError(err?.data?.message || "Invalid OTP code")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl relative">
        <h1 className="text-2xl font-bold text-center mb-8">Input Code</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading || otp.some((digit) => !digit)}
          >
            {isLoading ? "Verifying..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OTPPage
