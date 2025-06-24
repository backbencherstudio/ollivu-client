import { baseApi } from "../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // createCategory: builder.mutation({
    //   query: (data) => ({
    //     url: "/categories",
    //     method: "POST",
    //     body: data,
    //     headers: {
    //       authorization: `${localStorage.getItem("accessToken")}`,
    //     },
    //   }),
    //   invalidatesTags: ["Category"],
    // }),

    // getAllCategories: builder.query({
    //   query: () => ({
    //     url: "/categories",
    //     method: "GET",
    //     headers: {
    //       authorization: `${localStorage.getItem("accessToken")}`,
    //     },
    //   }),
    //   providesTags: ["Category"],
    // }),

    getReadExchangeNotificaion: builder.query({
      query: (id) => {
        return {
          url: `/shared/isReadExchange/${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetReadExchangeNotificaionQuery } = notificationApi;
