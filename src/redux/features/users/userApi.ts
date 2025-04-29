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

    getAllUsersByService: builder.query({
      query: ({ service, country, rating, searchTerm }) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (service) params.append('my_service', service);
        if (country) params.append('country', country);
        if (rating) params.append('rating', rating.toString());
        
        return {
          url: `/auth/allUsers?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['User'],
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
    }),

    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: `/auth/allUsers?searchTerm=${searchTerm}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllUsersByServiceQuery,
  useGetSingleUserQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUpdateUserServicesMutation,
  useDeleteUserServicesMutation,
  useUploadPortfolioMutation,
  useDeletePortfolioMutation,
  useUploadCertificateMutation,
  useDeleteCertificateMutation,
  useSearchUsersQuery,
} = usersApi;
