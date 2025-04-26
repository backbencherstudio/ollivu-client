import { baseApi } from "../../api/baseApi";

const exchangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExchange: builder.query({
      query: () => ({
        url: `/categories/allExchangeData`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllExchangeQuery } = exchangeApi;
