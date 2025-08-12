import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Prefer Redux token; fallback to localStorage token on the client
      const stateToken = (getState() as any)?.auth?.token as string | null;
      let token: string | null = stateToken ?? null;

      if (!token && typeof window !== "undefined") {
        try {
          token = localStorage.getItem("accessToken");
        } catch (_) {
          token = null;
        }
      }

      if (token) {
        // Ensure the Authorization header is correctly formatted
        const hasBearerPrefix = /^bearer\s/i.test(token);
        headers.set("Authorization", hasBearerPrefix ? token : `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Category",
    "Review",
    "Report",
    "SubCategory",
    "Terms",
    "Privacy",
    "profileReport",
    "ExchangeNotification",
    "Exchange"
  ],
});
