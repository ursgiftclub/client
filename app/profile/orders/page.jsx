"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "shipped":
        return "bg-indigo-100 text-indigo-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "returned":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-secondary";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/orders");

      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!orders.length) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-[2rem] border border-border bg-card p-12 text-center shadow-sm">
            <div className="mb-4 text-6xl">📦</div>

            <h1 className="mb-3 text-3xl font-bold">No Orders Yet</h1>

            <p className="mb-8 text-muted-foreground">
              Start shopping and place your first order.
            </p>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>

          <p className="mt-2 text-muted-foreground">
            Track and manage all your orders.
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order Number
                    </p>

                    <h2 className="font-bold text-foreground">
                      {order.orderNumber}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusColor(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentColor(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>

                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Items</p>

                      <p className="font-medium">{order.items?.length || 0}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Total</p>

                      <p className="font-bold text-primary">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="text-sm text-muted-foreground">
                    Payment Method:
                    <span className="ml-1 font-medium capitalize text-foreground">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order._id}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="mt-5 border-t border-border pt-5">
                <div className="flex flex-wrap gap-2">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-secondary px-3 py-1 text-xs"
                    >
                      {item.productName}
                    </span>
                  ))}

                  {order.items?.length > 3 && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
