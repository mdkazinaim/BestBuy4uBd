import baseApi from "./BaseApi/BaseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: '/auth/login',
        method: 'POST',
        body: loginData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
    refreshToken: builder.mutation({
      query: (token) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: { token },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (userId) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { userId },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ id, newPassword, token }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { id, newPassword },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/create-user',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
} = authApi;
