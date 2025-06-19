"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Send, X, Loader2 } from "lucide-react";
import { useSendEmailResultsMutation } from "../features/auth/surveryApi";
import { selectUser, selectRecommendations } from "../features/auth/authSlice";
import { set } from "react-hook-form";
const EmailResultsPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const recommendations = useSelector(selectRecommendations);
  const token = useSelector((state) => state?.auth?.token); // Move token retrieval here
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(token);
  // API hook for sending email (can be removed if not needed)

  const name = user?.username || "there";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!recommendations) {
      setError("No recommendations available to send");
      return;
    }

    try {
      const recommendationText = `Hello ${name},\n\nThank you for using our service.\n\nBased on your responses, here are preventive health recommendations just for you:\n\n${recommendations}\n\nPlease take a moment to share these with a loved one or your medical provider.\n\nTo learn more, please visit www.smartshealth.net`;
      console.log(token, "Token from state");

      setIsLoading(true);
      const response = await fetch(
        "http://api.smarthealthnow.io/api/v1/user/sent/mail/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            send_to: email,
            recommendation: recommendationText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      setIsLoading(false);
      const data = await response.json();
      console.log("Manual fetch response:", data);
      navigate("/success");
    } catch (err) {
      setIsLoading(false);
      console.error("Manual fetch error:", err);
      setError(err.message || "Failed to send email. Please try again.");
    }
  };

  const handleClose = () => {
    navigate("/results");
  };

  const messageContent = `Hi, Below is a copy of my personalized heart and brain wellness plan. To learn more, please visit www.smartshealth.net\n\n${
    recommendations || "No recommendations available"
  }`;

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Review and Send Your Wellness Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email To
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message Preview
            </label>
            <textarea
              id="message"
              name="message"
              value={messageContent}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              rows={15}
              readOnly
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white transition-colors duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send Email
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailResultsPage;
