import { baseApi } from "../../api/baseApi";
import { ICreateUserRequest, ICreateUserResponse, IVerifyOTPRequest, IVerifyOTPResponse } from "../../types/authInterface";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<ICreateUserResponse, ICreateUserRequest>({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation<IVerifyOTPResponse, IVerifyOTPRequest>({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateUserMutation, useVerifyOTPMutation } = authApi;
