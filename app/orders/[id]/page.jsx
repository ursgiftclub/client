"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
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
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="mb-6 rounded-[2rem] border border-green-500/20 bg-green-500/10 p-6">
          <h1 className="text-2xl font-bold text-green-600">
            🎉 Order Placed Successfully
          </h1>

          <p className="mt-2 text-muted-foreground">
            Thank you for shopping with URS Gift Club.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Order Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>

                  <p className="font-semibold">{order.orderNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>

                  <p className="font-semibold capitalize">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Status
                  </p>

                  <p className="font-semibold capitalize">
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
            {/* Shipping Address */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>

              <div className="space-y-2">
                <p className="font-semibold">
                  {order.shippingAddress.fullName}
                </p>

                <p>+91 {order.shippingAddress.phone}</p>

                <p>{order.shippingAddress.addressLine1}</p>

                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}

                {order.shippingAddress.landmark && (
                  <p>Landmark: {order.shippingAddress.landmark}</p>
                )}

                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>

                <p>
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>{" "}
            {/* Order Items */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Ordered Items</h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>

                      {item.sku && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      )}

                      {!!Object.keys(item.variant || {}).length && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" • ")}
                        </p>
                      )}

                      {item.customization?.text && (
                        <p className="mt-2 text-sm text-primary">
                          Text: {item.customization.text}
                        </p>
                      )}

                      {item.customization?.font && (
                        <p className="text-sm text-muted-foreground">
                          Font: {item.customization.font}
                        </p>
                      )}

                      {item.customization?.images?.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {item.customization.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image.url}
                              alt="Customization"
                              className="h-12 w-12 rounded-lg border border-border object-cover"
                            />
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span>
                          Qty: <strong>{item.quantity}</strong>
                        </span>

                        <span>
                          Price: ₹<strong>{item.finalPrice}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="font-bold">₹{item.lineTotal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>₹{order.shippingCharge}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>

                  <span>₹{order.discount}</span>
                </div>

                <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
                  <span>Total</span>

                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>{" "}
            {/* Payment Info */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Payment Information</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>

                  <span className="font-medium capitalize">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            {/* Notes */}
            {order.notes && (
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Order Notes</h2>

                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            )}
            {/* Actions */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <button
                onClick={() => router.push("/")}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => router.push("/profile/orders")}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-border font-semibold transition hover:bg-secondary"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
