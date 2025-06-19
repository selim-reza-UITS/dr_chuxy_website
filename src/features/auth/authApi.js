import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/generate/api/",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["user"], // Optionally invalidate user-related cache
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/user/login/",
        method: "POST",
        body: { email, otp },
      }),
      invalidatesTags: ["user"], // Invalidate user cache on successful verification
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = authApi;