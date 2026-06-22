"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { loadCart } from "@/lib/cartService";

const initialAddressForm = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  addressType: "home",
  isDefault: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [cartData, setCartData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [addressForm, setAddressForm] = useState(initialAddressForm);

  const [savingAddress, setSavingAddress] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [guestAddress, setGuestAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
  };

  const closeAddressModal = () => {
    resetAddressForm();
    setShowAddressModal(false);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone" || name === "alternatePhone") {
      const numbersOnly = value.replace(/\D/g, "");

      setAddressForm((prev) => ({
        ...prev,
        [name]: numbersOnly.slice(0, 10),
      }));

      return;
    }

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();

    if (addressForm.phone.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (
      addressForm.alternatePhone &&
      addressForm.alternatePhone.length !== 10
    ) {
      toast.error("Please enter a valid alternate phone number");
      return;
    }

    try {
      setSavingAddress(true);

      const { data } = await axiosInstance.post("/address", addressForm);

      setAddresses((prev) => [data.address, ...prev]);

      setSelectedAddress(data.address._id);

      resetAddressForm();

      setShowAddressModal(false);

      toast.success("Address added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  // const loadCheckout = async () => {
  //   try {
  //     setLoading(true);

  //     if (isAuthenticated) {
  //       const [addressRes, cartRes] = await Promise.all([
  //         axiosInstance.get("/address"),
  //         axiosInstance.get("/cart"),
  //       ]);

  //       setAddresses(addressRes.data.addresses || []);

  //       const defaultAddress = addressRes.data.addresses?.find(
  //         (address) => address.isDefault,
  //       );

  //       if (defaultAddress) {
  //         setSelectedAddress(defaultAddress._id);
  //       }

  //       setCartData(cartRes.data);
  //     } else {
  //       const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

  //       setCartData({
  //         items: cart.items || [],
  //         itemCount: cart.items?.length || 0,
  //         subtotal:
  //           cart.items?.reduce(
  //             (sum, item) =>
  //               sum + (item.lineTotal || item.finalPrice * item.quantity || 0),
  //             0,
  //           ) || 0,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     toast.error(error.response?.data?.message || "Failed to load checkout");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadCheckout = async () => {
    try {
      setLoading(true);

      const cartData = await loadCart(isAuthenticated);

      console.log(cartData);

      setCartData(cartData);

      if (isAuthenticated) {
        const { data } = await axiosInstance.get("/address");

        setAddresses(data.addresses || []);

        const defaultAddress = data.addresses?.find(
          (address) => address.isDefault,
        );

        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to load checkout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckout();

    return () => {
      resetAddressForm();
      setAddresses([]);
      setSelectedAddress("");
      setCartData(null);
    };
  }, []);

  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }

    try {
      setPlacingOrder(true);

      const { data } = await axiosInstance.post("/payments/create-order", {
        addressId: selectedAddress,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,

        name: "URS Gift Club",
        description: "Order Payment",

        handler: async (response) => {
          try {
            const verify = await axiosInstance.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              addressId: selectedAddress,
            });

            toast.success("Payment Successful");

            router.push(`/orders/${verify.data.order._id}`);
          } catch (error) {
            console.log(error);
            toast.error(
              error.response?.data?.message || "Payment verification failed",
            );
          }
        },

        prefill: {
          name:
            addresses.find((a) => a._id === selectedAddress)?.fullName || "",

          contact:
            addresses.find((a) => a._id === selectedAddress)?.phone || "",
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start payment");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleGuestRazorpayPayment = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      const { data } = await axiosInstance.post(
        "/payments/create-order-guest",
        {
          guestInfo,
          shippingAddress: {
            fullName: guestInfo.fullName,
            phone: guestInfo.phone,

            addressLine1: guestAddress.addressLine1,
            addressLine2: guestAddress.addressLine2,
            landmark: guestAddress.landmark,

            city: guestAddress.city,
            state: guestAddress.state,
            country: guestAddress.country,
            pincode: guestAddress.pincode,
          },
          items: cart.items,
        },
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,

        name: "URS Gift Club",

        prefill: {
          name: guestInfo.fullName,
          email: guestInfo.email,
          contact: guestInfo.phone,
        },

        handler: async (response) => {
          const verify = await axiosInstance.post("/payments/verify-guest", {
            guestInfo,

            shippingAddress: {
              fullName: guestInfo.fullName,
              phone: guestInfo.phone,

              addressLine1: guestAddress.addressLine1,
              addressLine2: guestAddress.addressLine2,
              landmark: guestAddress.landmark,

              city: guestAddress.city,
              state: guestAddress.state,
              country: guestAddress.country,
              pincode: guestAddress.pincode,
            },

            items: cart.items,

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          });

          localStorage.removeItem("cart");

          // localStorage.setItem("guestOrderEmail", guestInfo.email);

          // localStorage.setItem("guestOrderId", verify.data.order._id);

          toast.success("Payment Successful");

          router.push(
            `/guest-order/${verify.data.order._id}?token=${verify.data.guestAccessToken}`,
          );
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start payment");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }

    try {
      setPlacingOrder(true);

      const { data } = await axiosInstance.post("/orders", {
        addressId: selectedAddress,
        paymentMethod: "cod",
      });

      toast.success("Order placed successfully");

      router.push(`/orders/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
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
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {isAuthenticated
                    ? "Shipping Address"
                    : "Contact & Shipping Details"}
                </h2>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  + Add Address
                </button>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="rounded-2xl border border-border p-5">
                    <h3 className="mb-4 text-lg font-semibold">
                      Contact Information
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>

                        <input
                          value={guestInfo.fullName}
                          onChange={(e) =>
                            setGuestInfo((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Email <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) =>
                            setGuestInfo((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Phone Number <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            +91
                          </span>

                          <input
                            maxLength={10}
                            value={guestInfo.phone}
                            onChange={(e) =>
                              setGuestInfo((prev) => ({
                                ...prev,
                                phone: e.target.value.replace(/\D/g, ""),
                              }))
                            }
                            className="h-12 w-full rounded-xl border border-border bg-background pl-14 pr-4 outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="rounded-2xl border border-border p-5">
                    <h3 className="mb-4 text-lg font-semibold">
                      Shipping Address
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          Address Line 1 <span className="text-red-500">*</span>
                        </label>

                        <input
                          value={guestAddress.addressLine1}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              addressLine1: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          Address Line 2
                        </label>

                        <input
                          value={guestAddress.addressLine2}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              addressLine2: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          Landmark
                        </label>

                        <input
                          value={guestAddress.landmark}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              landmark: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          City <span className="text-red-500">*</span>
                        </label>

                        <input
                          value={guestAddress.city}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          State <span className="text-red-500">*</span>
                        </label>

                        <input
                          value={guestAddress.state}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Pincode <span className="text-red-500">*</span>
                        </label>

                        <input
                          maxLength={6}
                          value={guestAddress.pincode}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              pincode: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Country
                        </label>

                        <input
                          value={guestAddress.country}
                          onChange={(e) =>
                            setGuestAddress((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                  <p className="mb-4 text-muted-foreground">No address found</p>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="rounded-xl bg-primary px-5 py-3 text-primary-foreground"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <button
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedAddress === address._id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {/* Your existing address card JSX unchanged */}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <p className="font-medium">Cash On Delivery</p>

                  <p className="text-sm text-muted-foreground">
                    Pay when your order arrives
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <p className="font-medium">Pay Online</p>

                  <p className="text-sm text-muted-foreground">
                    UPI, Cards, Net Banking & Wallets
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

              <div className="max-h-105 space-y-4 overflow-y-auto">
                {cartData?.items?.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 border-b border-border pb-4"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-semibold">
                        {item.name}
                      </h3>

                      {!!item.variant?.combination && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Object.entries(item.variant.combination)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" • ")}
                        </p>
                      )}

                      {item.customization?.text && (
                        <p className="mt-1 text-xs text-primary">
                          Text: {item.customization.text}
                        </p>
                      )}

                      {item.customization?.images?.length > 0 && (
                        <p className="text-xs text-primary">
                          {item.customization.images.length} Custom Image(s)
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </span>

                        <span className="font-semibold">₹{item.lineTotal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Items ({cartData?.itemCount || 0})
                  </span>

                  <span>₹{cartData?.subtotal || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
                  <span>Total</span>

                  <span>₹{cartData?.subtotal || 0}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    handleGuestRazorpayPayment();
                    return;
                  }

                  if (paymentMethod === "cod") {
                    handlePlaceOrder();
                  } else {
                    handleRazorpayPayment();
                  }
                }}
                disabled={
                  placingOrder ||
                  !cartData?.items?.length ||
                  (isAuthenticated
                    ? !selectedAddress
                    : !guestInfo.fullName ||
                      !guestInfo.email ||
                      !guestInfo.phone ||
                      !guestAddress.addressLine1 ||
                      !guestAddress.city ||
                      !guestAddress.state ||
                      !guestAddress.pincode)
                }
                className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placingOrder
                  ? "Opening Payment..."
                  : !isAuthenticated
                    ? "Pay Now"
                    : paymentMethod === "cod"
                      ? "Place Order"
                      : "Pay Now"}
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                By placing this order you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Address</h2>

              <button
                onClick={closeAddressModal}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
              >
                ✕
              </button>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
              Fields marked with{" "}
              <span className="font-semibold text-red-500">*</span> are
              required.
            </p>

            <form
              onSubmit={handleCreateAddress}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                  placeholder="Enter full name"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    +91
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="h-12 w-full rounded-xl border border-border bg-background pl-14 pr-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Alternate Phone
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    +91
                  </span>

                  <input
                    type="tel"
                    name="alternatePhone"
                    value={addressForm.alternatePhone}
                    onChange={handleAddressChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="h-12 w-full rounded-xl border border-border bg-background pl-14 pr-4 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Address Type
                </label>

                <select
                  name="addressType"
                  value={addressForm.addressType}
                  onChange={handleAddressChange}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>

                <input
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  placeholder="House No, Street, Area"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Address Line 2
                </label>

                <input
                  name="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, Building, Floor"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Landmark */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Landmark
                </label>

                <input
                  name="landmark"
                  value={addressForm.landmark}
                  onChange={handleAddressChange}
                  placeholder="Near Bus Stand"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>

                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  placeholder="Hisar"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  State <span className="text-red-500">*</span>
                </label>

                <input
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  placeholder="Haryana"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Pincode <span className="text-red-500">*</span>
                </label>

                <input
                  name="pincode"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  maxLength={6}
                  placeholder="125001"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Country
                </label>

                <input
                  name="country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                />
              </div>

              {/* Default Address */}
              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                  className="h-4 w-4"
                />

                <span className="text-sm">Make this my default address</span>
              </label>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {savingAddress ? "Saving Address..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
