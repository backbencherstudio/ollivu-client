import { baseApi } from "../../api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReviewReport: builder.mutation({
      query: (data) => ({
        url: "/shared/report",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Report", "User"],
    }),

    getAllReport: builder.query({
      query: () => {
        return {
          url: `/shared/report`,
          method: "GET",
        };
      },
      providesTags: ["Report", "User"],
    }),

  }),
});

export const { useCreateReviewReportMutation } = reportApi;
