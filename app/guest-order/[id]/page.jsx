"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";

import axiosInstance from "@/lib/axios";
import OrderDetailsView from "@/components/orders/OrderDetailsView";

export default function GuestOrderDetailsPage() {
  const params = useParams();

  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);

  const orderId = params.id;

  const token = searchParams.get("token");

  const loadOrder = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        `/orders/guest/${orderId}?token=${token}`,
      );

      setOrder(data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && token) {
      loadOrder();
    }
  }, [orderId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";

      case "confirmed":
        return "bg-blue-500";

      case "processing":
        return "bg-indigo-500";

      case "shipped":
        return "bg-purple-500";

      case "delivered":
        return "bg-green-500";

      case "cancelled":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order Not Found</h2>

          <p className="mt-2 text-muted-foreground">
            This order doesn't exist or the link is invalid.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return <OrderDetailsView order={order} isGuest />;
}
