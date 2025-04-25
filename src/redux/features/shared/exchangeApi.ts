import { baseApi } from "../../api/baseApi";

export const exchangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExchange: builder.mutation({
      query: (data) => ({
        url: "/exchange",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useCreateExchangeMutation } = exchangeApi;
