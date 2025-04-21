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

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "PATCH",
        body: data, 
      }),
      invalidatesTags: ["User"],
    }),
    // Add new endpoint for updating services
    updateUserServices: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/auth/addServices/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useUpdateUserServicesMutation,
} = usersApi;
