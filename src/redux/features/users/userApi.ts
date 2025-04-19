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

    // getFilteredUsers: builder.query({
    //   query: (searchTerm: string) => ({
    //     url: `/auth/allUsers?searchTerm=${searchTerm}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["User"],
    // }),

    getFilteredUsers: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/auth/allUsers?${query}`;
      },
    }),

  }),
});

export const { useGetAllUsersQuery, useGetFilteredUsersQuery } = usersApi;
