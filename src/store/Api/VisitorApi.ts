import baseApi from "./BaseApi/BaseApi";

export const visitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisitorStats: builder.query({
      query: () => "/visitor-tracking/stats",
      // Refetch/poll statistics every 10 seconds to make the dashboard feel real-time and alive!
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetVisitorStatsQuery,
} = visitorApi;
