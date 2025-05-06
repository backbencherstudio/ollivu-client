import { baseApi } from "../../api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: data,
                headers: {
                    authorization: `${localStorage.getItem('accessToken')}`
                }
            }),
            invalidatesTags: ["Category"]
        }),

        getAllCategories: builder.query({
            query: () => ({
                url: "/categories",
                method: "GET",
                headers: {
                    authorization: `${localStorage.getItem('accessToken')}`
                }
            }),
            providesTags: ["Category"]
        }),

        updateCategory: builder.mutation({
            query: (data) => ({
                url: `/categories/updateCategory/${data.id}`,
                method: "PATCH",
                body: data,
                headers: {
                    authorization: `${localStorage.getItem('accessToken')}`
                }
            }),
            invalidatesTags: ["Category"]
        })

    })
});

export const { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation } = categoriesApi;