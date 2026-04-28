// Helper function to build query string
import { Product } from "@/types/Product/Product";
import baseApi from "./BaseApi/BaseApi";
import { ApiResponse, QueryOptions } from "@/types/Api/ApiResponse";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ApiResponse<Product[]>, void | QueryOptions>({
      query: (options = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(options as QueryOptions).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        return {
          url: `/product`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<ApiResponse<Product>, { id: string }>({
      query: ({ id }) => `/product/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: `/product/add-product`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/product/${id}/update-product`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}/delete-product`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    getNewArrivals: builder.query<ApiResponse<Product[]>, void>({
      query: () => `/product/new-arrivals`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetNewArrivalsQuery,
} = productApi;
