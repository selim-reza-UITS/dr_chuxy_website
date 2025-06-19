"use client"

import { createContext, useState, useEffect } from "react"

export const UserContext = createContext()

const UserContextProvider = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    formData: {},
    recommendations: [],
  })

  useEffect(() => {
    // Load user data from local storage on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    // Save user data to local storage whenever it changes
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  const generateRecommendations = (formData) => {
    const recommendations = []
    if (formData[2] === "yes") {
      recommendations.push("Consider a financial advisor.")
    }
    if (formData[3] === "yes") {
      recommendations.push("Explore investment options.")
    }
    if (formData[4] === "yes") {
      recommendations.push("Create a budget.")
    }
    return recommendations
  }

  // Update the saveFormData function to handle both formats (form data object or structured object)
  const saveFormData = (data) => {
    // Check if data is in the new format (with name, recommendations properties)
    if (data.name !== undefined || data.recommendations !== undefined) {
      setUser((prev) => ({
        ...prev,
        name: data.name || prev.name,
        recommendations: data.recommendations || prev.recommendations,
        email: data.email || prev.email,
        formData: data.formData || prev.formData,
      }))
    }
    // Original format (form data with numeric keys)
    else {
      const firstName = data[1]?.split(" ")[0] || ""

      setUser((prev) => ({
        ...prev,
        formData: data,
        name: firstName,
        recommendations: generateRecommendations(data),
      }))
    }
  }

  return <UserContext.Provider value={{ user, setUser, saveFormData }}>{props.children}</UserContext.Provider>
}

export default UserContextProvider
