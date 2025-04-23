import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  // Add this endpoint to your existing authApi
  endpoints: (builder) => ({



    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          document.cookie = `accessToken=${response.data.accessToken}; path=/; secure; samesite=strict`;
        }
        return response;
      },
      invalidatesTags: ["User"],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: data,
        credentials: "include", 
      }),
      invalidatesTags: ["User"],
    }),

    getAllExchangeData: builder.query({
      query: (query) => {
        console.log(46, query);
        
        return {
          url: `/shared/exchange`,
          method: "GET",
          params: query,
        }
      },
      providesTags:['User']
    }),



    getMessages: builder.query({
      query: ({ senderId, receiverId }) => ({
        url: `/messages?senderId=${senderId}&receiverId=${receiverId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyOTPMutation,
  useLoginUserMutation,
} = authApi;
