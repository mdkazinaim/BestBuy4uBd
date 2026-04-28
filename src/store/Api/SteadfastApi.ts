import baseApi from "./BaseApi/BaseApi";

export const steadfastApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSteadfastOrder: build.mutation({
      query: (data) => ({
        url: "/steadfast/create-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Steadfast", "Orders"],
    }),
    checkSteadfastStatus: build.query({
      query: (id) => `/steadfast/status/${id}`,
    }),
    bulkCheckSteadfastStatus: build.mutation({
      query: (consignmentIds) => ({
        url: "/steadfast/status/bulk",
        method: "POST",
        body: { consignmentIds },
      }),
      invalidatesTags: ["Orders"],
    }),
    getSteadfastBalance: build.query({
      query: () => "/steadfast/balance",
      providesTags: ["Steadfast"],
    }),
    getSteadfastReturnRequests: build.query({
      query: (params) => ({
        url: "/steadfast/return-requests",
        method: "GET",
        params: params,
      }),
      providesTags: ["Steadfast"],
    }),
    getSteadfastPoliceStations: build.query({
      query: () => "/steadfast/police-stations",
    }),
  }),
});

export const {
  useCreateSteadfastOrderMutation,
  useCheckSteadfastStatusQuery,
  useBulkCheckSteadfastStatusMutation,
  useGetSteadfastBalanceQuery,
  useGetSteadfastReturnRequestsQuery,
  useGetSteadfastPoliceStationsQuery,
} = steadfastApi;
