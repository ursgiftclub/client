"use client";

import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";

import store from "@/redux/store";

import AuthProvider from "@/components/AuthProvider";

export default function RootProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>

      <Toaster
        position="top-left"
        toastOptions={{
          duration: 3000,

          style: {
            background: "#111111",
            color: "#FFFFFF",
          },

          success: {
            style: {
              background: "#10b981",
            },
          },

          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </Provider>
  );
}
