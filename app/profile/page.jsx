"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  FiPackage,
  FiMapPin,
  FiHeart,
  FiUser,
  FiLock,
  FiLogOut,
} from "react-icons/fi";

import axiosInstance from "@/lib/axios";

import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/auth/me");

      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      dispatch(logout());

      toast.success("Logged out");

      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Hello, {user?.name} 👋
              </h1>

              <p className="mt-1 text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-4">
          <Link
            href="/profile/orders"
            className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary"
          >
            <FiPackage className="h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">My Orders</h3>

              <p className="text-sm text-muted-foreground">
                Track and manage your orders
              </p>
            </div>
          </Link>
          <Link
            href="/profile/addresses"
            className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary"
          >
            <FiMapPin className="h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">My Addresses</h3>

              <p className="text-sm text-muted-foreground">
                Manage your delivery addresses
              </p>
            </div>
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary"
          >
            <FiHeart className="h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">Wishlist</h3>

              <p className="text-sm text-muted-foreground">
                Products you've saved
              </p>
            </div>
          </Link>{" "}
          <Link
            href="/profile/edit"
            className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary"
          >
            <FiUser className="h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">Edit Profile</h3>

              <p className="text-sm text-muted-foreground">
                Update your account information
              </p>
            </div>
          </Link>
          <Link
            href="/profile/change-password"
            className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:border-primary"
          >
            <FiLock className="h-6 w-6 text-primary" />

            <div>
              <h3 className="font-semibold">Change Password</h3>

              <p className="text-sm text-muted-foreground">
                Keep your account secure
              </p>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-[2rem] border border-red-500 text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          <FiLogOut className="h-5 w-5" />

          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </main>
  );
}
