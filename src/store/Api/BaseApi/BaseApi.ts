
import { logOut, setUser } from "@/store/Slices/AuthSlice/authSlice";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api/v1";
    }
  }
  return "https://spark-tech-server.vercel.app/api/v1";
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth.user?.accessToken;
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const state = api.getState() as any;
    const refreshToken = state.auth.user?.refreshToken;
    if (!refreshToken) {
      api.dispatch(logOut());
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "user/refreshToken",
        method: "POST",
        body: {
          authorization: refreshToken,
        },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch(setUser(refreshResult.data as any));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Product",
    "Categories",
    "Orders",
    "Users",
    "Banner",
    "GoogleAnalytics",
    "FacebookPixel",
    "Tracking",
    "Steadfast",
    "Settings",
  ],
});
export default baseApi;
