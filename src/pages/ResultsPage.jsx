"use client";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Copy, Send, RefreshCw, LogOutIcon, Loader2 } from "lucide-react";
import { useGetUserResponseQuery } from "../features/auth/surveryApi";
import {
  selectUser,
  selectRecommendations,
  logout,
  saveRecommendations,
} from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { RichTextDisplay } from "../components/RichTextDisplay";

const ResultsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const storedRecommendations = useSelector(selectRecommendations);

  // Fetch user response from API
  const { data: responseData, isLoading, error } = useGetUserResponseQuery();

  // Get user name from API response or user data
  const name =
    responseData?.user_responses?.find((r) =>
      r.question.toLowerCase().includes("name")
    )?.response_text ||
    user?.username ||
    "User";

  // Use API recommendations if available, otherwise use stored recommendations
  const recommendations = responseData?.ai_response
    ? responseData.ai_response
    : storedRecommendations;

  // Save recommendations to Redux if we get them from API
  if (
    responseData?.ai_response &&
    responseData.ai_response !== storedRecommendations
  ) {
    dispatch(saveRecommendations(responseData.ai_response));
  }

  const handleCopyToClipboard = () => {
    const text = `
Hello ${name},

Thank you for using our service.

Based on your responses, here are preventive health recommendations just for you:

${recommendations}

Please take a moment to email these to yourself, a loved one or your medical provider.
    `;

    navigator.clipboard.writeText(text);
    toast.success("Recommendations copied to clipboard!");
  };

  const handleEmailResults = () => {
    navigate("/email-results");
  };

  const handleResubmit = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <p className="text-red-500 mb-4">Failed to load your results</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retake Survey
          </button>
        </div>
      </div>
    );
  }

  // No recommendations available
  if (!recommendations) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 ">
          <p className="text-gray-600 mb-4">No recommendations available</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Take Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 rounded-2xl">
      <div className="p-6 md:p-8">
        <div className="space-y-4 mb-8">
          <div className="flex text-start ">
            <div className=" p-12 bg-gray-50 rounded-lg shadow-lg">
              <div className="xl:max-h-[600px] lg:max-h-[500px] md:max-h-[400px] max-h-96 overflow-y-auto">
                <RichTextDisplay content={recommendations} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
          >
            <Copy className="h-5 w-5 mr-1" />
            Copy
          </button>

          <button
            onClick={handleEmailResults}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Send className="h-5 w-5 mr-1" />
            Email Results
          </button>

          <button
            onClick={handleResubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-1" />
            Resubmit Form
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 px-4 py-2 rounded-md text-white gap-2"
          >
            <LogOutIcon className="h-5 w-5" />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;