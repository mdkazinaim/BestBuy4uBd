import baseApi from "./BaseApi/BaseApi";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    createSubCategory: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/categories/${categoryId}/subcategories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryName }) => ({
        url: `/categories/${categoryId}/subcategories/${subCategoryName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategoryOrder: builder.mutation({
      query: (data) => ({
        url: "/categories/reorder",
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Categories"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ categoryId, subCategoryName, data }) => ({
        url: `/categories/${categoryId}/subcategories/${subCategoryName}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateCategoryOrderMutation,
  useUpdateSubCategoryMutation,
} = categoriesApi;
