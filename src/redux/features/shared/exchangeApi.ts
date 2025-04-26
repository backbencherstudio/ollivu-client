import { baseApi } from "../../api/baseApi";

export const exchangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExchange: builder.mutation({
      query: (data) => ({
        url: "/shared/exchange",
        method: "POST",
        body: data,
        formData: true,
      }),
    }),
  }),
});

export const { useCreateExchangeMutation } = exchangeApi;
