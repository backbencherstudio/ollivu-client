import { baseApi } from "../../api/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubCategory: builder.mutation({
            query: (data) => {
                const categoryId = data.get('categoryId');
                return {
                    url: `/categories/${categoryId}`,
                    method: "PATCH",
                    body: data,
                    headers: {
                        authorization: `${localStorage.getItem('accessToken')}`
                    }
                };
            },
            invalidatesTags: ["Category"]
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
});

export const { useCreateSubCategoryMutation, useRemoveSubCategoryMutation } = subCategoryApi;