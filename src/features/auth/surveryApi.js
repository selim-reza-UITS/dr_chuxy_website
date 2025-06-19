import { apiSlice } from "../api/apiSlice";

export const surveyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => ({
        url: "/admin/questions/api/",
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
    submitSurveyResponse: builder.mutation({
      query: (responseData) => ({
        url: "/user/questions/response/",
        method: "POST",
        body: { response_form_data: responseData },
      }),
      invalidatesTags: ["Responses"],
    }),
    getUserResponse: builder.query({
      query: () => ({
        url: "/user/questions/response/",
        method: "GET",
      }),
      providesTags: ["Responses"],
    }),
    sendEmailResults: builder.mutation({
      query: ({ email, recommendation }) => ({
        url: "/user/sent/mail/",
        method: "POST",
        body: { 
          send_to: email, 
          recommendation: recommendation 
        },
      }),
    }),
  }),
});

export const { 
  useGetQuestionsQuery, 
  useSubmitSurveyResponseMutation, 
  useGetUserResponseQuery,
  useSendEmailResultsMutation 
} = surveyApi;
