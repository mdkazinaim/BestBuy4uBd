import baseApi from "./BaseApi/BaseApi";

export const visitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisitorStats: builder.query({
      query: (range?: string) => `/visitor-tracking/stats${range ? `?range=${range}` : ""}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetVisitorStatsQuery,
} = visitorApi;
