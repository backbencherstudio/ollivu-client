import { baseApi } from "../../api/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubCategory: builder.mutation({
            query: (data) => ({
                url: `/categories/${data.categoryId}`,
                method: "POST",
                body: data,
                headers: {
                    authorization: `${localStorage.getItem('accessToken')}`
                }
            }),
            invalidatesTags: ["SubCategory"]
        }),

        removeSubCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
                headers: {
                    authorization: `${localStorage.getItem('accessToken')}`
                }
            }),
            invalidatesTags: ["SubCategory"]
        }),
    })
})

export const { useCreateSubCategoryMutation, useRemoveSubCategoryMutation } = subCategoryApi;