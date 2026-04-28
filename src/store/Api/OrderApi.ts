import baseApi from "./BaseApi/BaseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order/create-order',
        method: 'POST',
        body: orderData.body,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}/delete-order`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
    getAllOrders: builder.query({
      query: (params) => ({
        url: '/order',
        method: 'GET',
        params,
      }),
      providesTags: ['Orders'],
    }),
    trackOrderByPhone: builder.query({
      query: (phone) => `/order/track-order?phone=${phone}`,
      providesTags: ['Orders'],
    }),
    trackOrderByConsignmentId: builder.query({
      query: (id) => `/order/track-order?consignmentId=${id}`,
      providesTags: ['Orders'],
    }),
    trackOrderByOrderId: builder.query({
      query: (id) => `/order/track-order?orderId=${id}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useTrackOrderByPhoneQuery,
  useTrackOrderByConsignmentIdQuery,
  useTrackOrderByOrderIdQuery,
} = orderApi;