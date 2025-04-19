import { baseApi } from "../../api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
            providesTags: ["Category"]
        })
    })
});

export const { useGetAllCategoriesQuery } = categoriesApi;