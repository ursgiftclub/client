"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import OrderDetailsView from "@/components/orders/OrderDetailsView";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(`/orders/${params.id}`);

      setOrder(data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order");

      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!order) {
    router.push("/");
  }

  return <OrderDetailsView order={order} />;
}
