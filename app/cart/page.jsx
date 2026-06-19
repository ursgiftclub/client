"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FiTrash2, FiArrowLeft } from "react-icons/fi";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { setCart, clearCart } from "@/redux/slices/cartSlice";
import { loadCart as loadCartService } from "@/lib/cartService";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [cartData, setCartData] = useState({
    items: [],
    subtotal: 0,
    itemCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await loadCartService(isAuthenticated);

      setCartData({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
      });

      dispatch(setCart(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load cart");

      setCartData({
        items: [],
        subtotal: 0,
        itemCount: 0,
      });

      dispatch(clearCart());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const handleRemove = async (item) => {
    try {
      // Logged In User
      if (isAuthenticated) {
        await axiosInstance.delete(`/cart/item/${item.cartItemId}`);

        toast.success("Removed from cart");

        await loadCart();

        return;
      }

      // Guest User
      const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      cart.items = cart.items.filter(
        (cartItem) => cartItem.cartItemId !== item.cartItemId,
      );

      localStorage.setItem("cart", JSON.stringify(cart));

      const data = await loadCartService(false);

      dispatch(setCart(data));

      toast.success("Removed from cart");

      await loadCart();
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleQuantityChange = async (item, quantity) => {
    try {
      if (quantity > item.stock) {
        toast.error(`Only ${item.stock} items available`);
        return;
      }

      if (quantity <= 0) {
        handleRemove(item);
        return;
      }

      // Logged In User
      if (isAuthenticated) {
        await axiosInstance.put(`/cart/item/${item.cartItemId}`, {
          quantity,
        });

        await loadCart();

        return;
      }

      // Guest User
      const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      const target = cart.items.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          (cartItem.variantId || null) === (item.variantId || null) &&
          JSON.stringify(cartItem.customization) ===
            JSON.stringify(item.customization),
      );

      if (!target) {
        return;
      }

      target.quantity = quantity;

      localStorage.setItem("cart", JSON.stringify(cart));

      const data = await loadCartService(false);

      dispatch(setCart(data));
      await loadCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const clearCartHandler = async () => {
    try {
      if (isAuthenticated) {
        await axiosInstance.delete("/cart/clear");

        await loadCart();

        return;
      }

      localStorage.removeItem("cart");

      dispatch(clearCart());

      setCartData({
        items: [],
        subtotal: 0,
        itemCount: 0,
      });

      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout!");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex justify-center py-32">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </main>
    );
  }

  if (!loading && (!cartData?.items || cartData.items.length === 0)) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Your Cart is Empty
            </h1>

            <p className="mb-8 text-muted-foreground">
              Start shopping to add items to your cart.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // const subtotal = cartData.subtotal || 0;

  const itemCount = cartData.itemCount || 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              {cartData?.items?.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.variantId || "simple"}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="border-b border-border p-5 last:border-b-0"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Content */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="transition hover:text-primary"
                      >
                        <h3 className="line-clamp-2 font-semibold text-foreground">
                          {item.name}{" "}
                        </h3>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.finalPrice}
                        </span>

                        {item.salePrice && item.salePrice < item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.price}
                          </span>
                        )}
                      </div>

                      {/* Variant Attributes */}
                      {item.variant?.combination && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(item.variant.combination).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs"
                              >
                                {key}: {value}
                              </span>
                            ),
                          )}
                        </div>
                      )}

                      {/* Personalization */}
                      {(item.customization?.text ||
                        item.customization?.images?.length > 0) && (
                        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                          <p className="mb-2 text-xs font-semibold text-primary">
                            ✨ Personalization
                          </p>

                          {item.customization?.text && (
                            <div>
                              <p className="mb-1 text-xs text-muted-foreground">
                                Custom Message
                              </p>

                              <p
                                className="text-sm"
                                style={{
                                  fontFamily:
                                    item.customization.font || "inherit",
                                }}
                              >
                                {item.customization.text}
                              </p>
                            </div>
                          )}

                          {!!item.customization?.images?.length && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.customization.images.map((image) => (
                                <Image
                                  key={image.public_id}
                                  src={image.url}
                                  alt="Customization"
                                  width={60}
                                  height={60}
                                  className="h-14 w-14 rounded-lg border border-border object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-secondary"
                        >
                          −
                        </button>

                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>

                        <span className="ml-auto text-lg font-bold text-foreground">
                          ₹{item.lineTotal}
                        </span>
                      </div>

                      {item.stock <= 5 && (
                        <p className="mt-2 text-xs text-orange-500">
                          Only {item.stock} left in stock
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="self-start rounded-xl p-2 text-red-500 transition hover:bg-red-500/10"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 font-medium text-primary transition hover:opacity-80"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-foreground">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>

                  <span className="font-medium">₹{cartData.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-6">
                <span className="text-lg font-bold text-foreground">Total</span>

                <span className="text-2xl font-bold text-primary">
                  ₹{cartData.subtotal}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-2xl bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCartHandler}
                className="mt-3 w-full rounded-2xl border border-border py-3 transition hover:bg-secondary"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
