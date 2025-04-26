import { baseApi } from "../../api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/allUsers",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getSingleUser: builder.query({
      query: (id: string) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getCurrentUser: builder.query({
      query: (id: string) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserServices: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/addServices/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUserServices: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/deleteServices/${userId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    uploadPortfolio: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/setPortfolioImage/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deletePortfolio: builder.mutation({
      query: ({ userId }) => ({
        url: `/auth/deletePortfolioImage/${userId}`,
        method: "DELETE",
        // body: data
      }),
      invalidatesTags: ["User"],
    }),


    uploadCertificate: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/setCertificate/${userId}`, 
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),

    deleteCertificate: builder.mutation({
      query: ({ userId}) => ({
        url: `/auth/deleteCertificate/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    })

  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUpdateUserServicesMutation,
  useDeleteUserServicesMutation,
  useUploadPortfolioMutation,
  useDeletePortfolioMutation,
  useUploadCertificateMutation,
  useDeleteCertificateMutation
} = usersApi;
