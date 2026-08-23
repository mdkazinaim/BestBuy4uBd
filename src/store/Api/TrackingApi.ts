import baseApi from "./BaseApi/BaseApi";

export const TrackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackingSettings: builder.query({
      query: () => ({
        url: "/tracking",
        method: "GET",
      }),
      providesTags: ["Tracking"],
    }),
    updateTrackingSettings: builder.mutation({
      query: (data) => ({
        url: "/tracking/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tracking"],
    }),
    getAnalyticsDashboard: builder.query({
      query: () => ({
        url: "/analytics/dashboard",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTrackingSettingsQuery, useUpdateTrackingSettingsMutation, useGetAnalyticsDashboardQuery } = TrackingApi;
