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
  }),
});

export const { useGetAllUsersQuery } = usersApi;
