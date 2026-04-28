import baseApi from "./BaseApi/BaseApi";

export const bkashApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBkashPayment: builder.mutation({
      query: (data) => ({
        url: "/bkash/payment/create",
        method: "POST",
        body: data,
      }),
    }),

    getBkashCallback: builder.query({
      query: () => ({
        url: "/bkash/payment/callback",
        method: "GET",
      }),
    }),

    getBkashRefund: builder.query({
      query: (trxID) => ({
        url: `/bkash/payment/refund/${trxID}`,
        method: "GET", 
      }),
    }),
  }),
});

export const {
  useCreateBkashPaymentMutation,
  useGetBkashCallbackQuery,
  useGetBkashRefundQuery,
} = bkashApi;
