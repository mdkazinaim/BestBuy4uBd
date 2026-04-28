import baseApi from "./BaseApi/BaseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Orders', 'Product'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;
