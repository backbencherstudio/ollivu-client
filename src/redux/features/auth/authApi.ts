import { baseApi } from "../../api/baseApi";
import {
  ICreateUserRequest,
  ICreateUserResponse,
  IVerifyOTPRequest,
  IVerifyOTPResponse,
} from "../../types/authInterface";

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    // user might not be in the response
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      transformResponse: (response: ILoginResponse) => {
        // Only store token if it exists
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          document.cookie = `accessToken=${response.data.accessToken}; path=/; secure; samesite=strict`;
        }
        return response;
      },
      invalidatesTags: ["User"],
    }),

    createUser: builder.mutation<ICreateUserResponse, ICreateUserRequest>({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
        // credentials: "include",  // Added credentials
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
        credentials: "include",  // Added credentials
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyOTPMutation,
  useLoginUserMutation,
} = authApi;
