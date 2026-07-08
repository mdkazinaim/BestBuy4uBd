import baseApi from "./BaseApi/BaseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateAdminInfo: builder.mutation({
      query: (data) => ({
        url: "/settings/admin-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateAdminInfoMutation } = settingsApi;
