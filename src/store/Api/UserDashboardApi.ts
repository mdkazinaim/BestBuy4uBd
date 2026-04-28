import baseApi from "./BaseApi/BaseApi";

export const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardStats: builder.query({
      query: (phone) => `/user-dashboard/stats?phone=${phone}`,
      providesTags: ['Orders'], // Re-using Orders tag since stats depend on orders
    }),
  }),
});

export const {
  useGetUserDashboardStatsQuery,
} = userDashboardApi;
