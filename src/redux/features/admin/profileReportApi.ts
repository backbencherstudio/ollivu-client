import { baseApi } from "../../api/baseApi";

const profileReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileReport: builder.query({
      query: () => ({
        url: "/auth/getProfileReport",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileReportQuery } = profileReportApi;
