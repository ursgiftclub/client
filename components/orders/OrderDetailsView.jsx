"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrderDetailsView({ order, isGuest = false }) {
  const router = useRouter();

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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Success Banner */}
        <div className="mb-6 rounded-[2rem] border border-green-500/20 bg-green-500/10 p-6">
          <h1 className="text-2xl font-bold text-green-600">
            🎉 Order Placed Successfully
          </h1>

          <p className="mt-2 text-muted-foreground">
            Thank you for shopping with URS Gift Club.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Order Information */}
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
            </div>

            {/* Ordered Items */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Ordered Items</h2>{" "}
              <div className="space-y-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 border-b border-border pb-5 last:border-0"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        SKU: {item.sku}
                      </p>

                      {/* Variant */}
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <span
                              key={key}
                              className="rounded-full bg-secondary px-3 py-1 text-xs"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Customization */}
                      {(item.customization?.text ||
                        item.customization?.images?.length > 0) && (
                        <div className="mt-3 rounded-xl bg-secondary/50 p-3">
                          {item.customization?.text && (
                            <p className="text-sm">
                              <span className="font-medium">Text:</span>{" "}
                              {item.customization.text}
                            </p>
                          )}

                          {item.customization?.font && (
                            <p className="mt-1 text-sm">
                              <span className="font-medium">Font:</span>{" "}
                              {item.customization.font}
                            </p>
                          )}

                          {item.customization?.images?.length > 0 && (
                            <div className="mt-3 flex gap-2">
                              {item.customization.images.map((image, idx) => (
                                <div
                                  key={idx}
                                  className="relative h-14 w-14 overflow-hidden rounded-lg border border-border"
                                >
                                  <Image
                                    src={image.url}
                                    alt="Customization"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Qty:{" "}
                          <span className="font-medium text-foreground">
                            {item.quantity}
                          </span>
                        </p>

                        <p className="font-bold">
                          ₹{item.lineTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {" "}
            {/* Guest Information */}
            {isGuest && order.guestInfo && (
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Customer Information</h2>

                <div className="space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Name</span>

                    <span className="font-medium">
                      {order.guestInfo.fullName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Email</span>

                    <span className="font-medium break-all">
                      {order.guestInfo.email}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phone</span>

                    <span className="font-medium">
                      +91 {order.guestInfo.phone}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Order Summary */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span>₹{order.shippingCharge.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>

                  <span>- ₹{order.discount.toLocaleString()}</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>

                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment Information */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Payment Information</h2>

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
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>{" "}
            {/* Tracking Information */}
            {(order.courierName ||
              order.trackingNumber ||
              order.estimatedDeliveryDate) && (
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">Tracking Information</h2>

                <div className="space-y-4">
                  {order.courierName && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Courier</span>

                      <span className="font-medium">{order.courierName}</span>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Tracking Number
                      </span>

                      <span className="font-medium break-all">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}

                  {order.estimatedDeliveryDate && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Expected Delivery
                      </span>

                      <span className="font-medium">
                        {new Date(
                          order.estimatedDeliveryDate,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Notes */}
            {order.notes && (
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Order Notes</h2>

                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            )}
            {/* Actions */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <Link
                href="/"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Continue Shopping
              </Link>

              {!isGuest && (
                <button
                  onClick={() => router.push("/profile/orders")}
                  className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-border font-semibold transition hover:bg-secondary"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
