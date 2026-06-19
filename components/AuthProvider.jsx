"use client";

import { useEffect } from "react";

import axiosInstance from "@/lib/axios";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { setUser, logout, setAuthChecked } from "@/redux/slices/authSlice";

import { setCart, clearCart } from "@/redux/slices/cartSlice";

import SplashScreen from "./SplashScreen";

import { loadCart } from "@/lib/cartService";

export default function AuthProvider({ children }) {
  const dispatch = useAppDispatch();

  const authChecked = useAppSelector((state) => state.auth.authChecked);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");

        dispatch(setUser(data.user));

        const cartData = await loadCart(true);

        dispatch(setCart(cartData));
      } catch {
        dispatch(logout());

        try {
          const cartData = await loadCart(false);

          dispatch(setCart(cartData));
        } catch {
          dispatch(clearCart());
        }
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!authChecked) {
    return <SplashScreen />;
  }

  return children;
}
