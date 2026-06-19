"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Thumbs } from "swiper/modules";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  FiShoppingCart,
  FiHeart,
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

import ProductCustomization from "@/components/product/ProductCustomization";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { setCart } from "@/redux/slices/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";

import axiosInstance from "@/lib/axios";
import { playSound } from "@/lib/playSound";
import { loadCart } from "@/lib/cartService";

export default function ProductPage({ params }) {
  const { slug } = use(params);

  const dispatch = useAppDispatch();

  const swiperRef = useRef(null);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [activeImage, setActiveImage] = useState(0);

  const [selectedCustomizations, setSelectedCustomizations] = useState({});

  const [selectedAttributes, setSelectedAttributes] = useState({});

  const [customizationUploading, setCustomizationUploading] = useState(false);

  const [customizationRemoving, setCustomizationRemoving] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // Fetch product
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get(`/products/${slug}`);

        setProduct(data.product);
      } catch (error) {
        toast.error(error.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProduct();
    }
  }, [slug]);

  // Auto select first available variant
  useEffect(() => {
    if (product?.productType === "variable" && product?.variants?.length) {
      const firstVariant =
        product.variants.find((variant) => variant.isActive) ||
        product.variants[0];

      setSelectedVariant(firstVariant);

      setSelectedAttributes(firstVariant.combination);

      const imageIndex = Math.max((firstVariant.mainImageIndex || 1) - 1, 0);

      setActiveImage(imageIndex);

      setTimeout(() => {
        swiperRef.current?.slideTo(imageIndex, 300);
      }, 50);
    }
  }, [product]);

  // Update variant on selection
  useEffect(() => {
    if (product?.productType !== "variable" || !product?.variants?.length)
      return;

    const matchedVariant = product.variants.find((variant) =>
      Object.entries(variant.combination).every(
        ([key, value]) => selectedAttributes[key] === value,
      ),
    );

    setSelectedVariant(matchedVariant || null);

    // Variant exists
    if (matchedVariant) {
      const imageIndex = Math.max((matchedVariant.mainImageIndex || 1) - 1, 0);

      setActiveImage(imageIndex);

      setTimeout(() => {
        swiperRef.current?.slideTo(imageIndex, 300);
      }, 50);
    }

    // Invalid combination
    else {
      setActiveImage(0);

      setTimeout(() => {
        swiperRef.current?.slideTo(0, 300);
      }, 50);
    }
  }, [selectedAttributes, product]);

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  // Not found
  if (!loading && !product) {
    notFound();
  }

  const productId = product._id || product.id;

  const isWishlisted = wishlistItems.some(
    (item) => (item._id || item.id) === productId,
  );

  // Images
  const productImages = product.commonImages?.length
    ? product.commonImages
    : [
        {
          url: "https://placehold.co/1000x1000/f7dce5/d46a8c?text=Gift",
        },
      ];

  // Price
  const basePrice =
    product.productType === "variable"
      ? selectedVariant?.salePrice || selectedVariant?.price || 0
      : product.salePrice || product.price || 0;

  const originalPrice =
    product.productType === "variable" ? selectedVariant?.price : product.price;

  // Stock
  const stock =
    product.productType === "variable"
      ? selectedVariant
        ? selectedVariant.stock
        : 0
      : product.stock || 0;

  // Customization price
  const customizationPrice =
    product.customization?.options
      ?.filter((opt) => selectedCustomizations[opt.id])
      ?.reduce((sum, opt) => sum + opt.price, 0) || 0;

  const finalPrice = basePrice + customizationPrice;

  // Cart
  const handleAddToCart = async () => {
    try {
      if (stock <= 0) {
        toast.error("Out of stock");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      const cartItem = {
        cartItemId: crypto.randomUUID(),

        productId: product._id,

        quantity,

        customization: {
          text: selectedCustomizations?.text || "",

          font: selectedCustomizations?.font || "",

          images:
            selectedCustomizations?.images?.map((img) => ({
              url: img.url,
              public_id: img.public_id,
            })) || [],
        },
      };

      if (product.productType === "variable") {
        cartItem.variantId = selectedVariant._id;
      }

      // Find same item
      const existingItemIndex = cart.items.findIndex((item) => {
        return (
          item.productId === cartItem.productId &&
          (item.variantId || null) === (cartItem.variantId || null) &&
          JSON.stringify(item.customization || {}) ===
            JSON.stringify(cartItem.customization || {})
        );
      });

      // Increase quantity if already exists
      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push(cartItem);
      }

      if (isAuthenticated) {
        await axiosInstance.post("/cart/add", cartItem);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      const cartData = await loadCart(isAuthenticated);

      dispatch(setCart(cartData));

      playSound();

      toast.success("Added to cart!");

      setQuantity(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart",
      );
    }
  };

  // Wishlist
  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));

      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));

      playSound();

      toast.success("Added to wishlist!");
    }
  };
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      {" "}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
        {/* Back */}
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground sm:mb-10"
        >
          <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:items-start">
          {/* Gallery */}
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-secondary via-background to-secondary/30 p-4 shadow-sm lg:sticky lg:top-28"
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Main Slider */}
              <div className="order-1 relative flex-1 overflow-hidden rounded-[2rem] bg-card lg:order-2">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".product-next",
                    prevEl: ".product-prev",
                  }}
                  onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                  className="rounded-[2rem]"
                >
                  {productImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-70 sm:h-95 md:h-125 lg:h-155">
                        <Image
                          src={image.url}
                          alt={product.name}
                          fill
                          priority
                          className="object-contain p-4 md:p-6"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Arrows */}
                <button className="product-prev absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:scale-105 md:flex">
                  <FiChevronLeft />
                </button>

                <button className="product-next absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:scale-105 md:flex">
                  <FiChevronRight />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="order-2 flex gap-3 overflow-x-auto scrollbar-hide lg:order-1 lg:flex-col lg:overflow-visible">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => swiperRef.current?.slideTo(index)}
                    className={`relative h-16 min-w-16 overflow-hidden rounded-2xl border-2 transition sm:h-20 sm:min-w-20 md:h-24 md:min-w-24 ${
                      activeImage === index
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            className="space-y-6"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            {/* Category */}
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground sm:text-sm">
                {product.categories?.[0]?.name || "Gift"}
              </p>

              <h1 className="mb-3 text-2xl font-bold leading-tight sm:text-4xl">
                {product.name}
              </h1>

              <p className="mb-4 text-muted-foreground">
                {product.shortDescription}
              </p>

              {/* Price */}
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-primary">
                    ₹{finalPrice.toFixed(2)}
                  </span>

                  {originalPrice > basePrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>

                {/* SKU + Stock */}
                {product.productType === "variable" && selectedVariant && (
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {/* <span>SKU: {selectedVariant.sku}</span> */}

                    <span
                      className={stock > 0 ? "text-green-500" : "text-red-500"}
                    >
                      {stock > 0
                        ? `Only ${stock} left in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Variant Selection */}
            {product.productType === "variable" &&
              product.attributes?.map((attribute) => (
                <div key={attribute.name} className="space-y-3">
                  <h3 className="font-semibold">{attribute.name}</h3>

                  <div className="flex flex-wrap gap-3">
                    {attribute.values.map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attribute.name]: value,
                          }))
                        }
                        className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                          selectedAttributes[attribute.name] === value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:border-primary"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Customization */}
            {product.customization?.enabled && (
              <ProductCustomization
                product={product}
                onCustomizationChange={setSelectedCustomizations}
                uploading={customizationUploading}
                setUploading={setCustomizationUploading}
                removing={customizationRemoving}
                setRemoving={setCustomizationRemoving}
              />
            )}

            {/* Desktop Quantity + Actions */}
            <div className="hidden gap-3 md:flex">
              {/* Quantity */}
              <div className="flex h-12 items-center rounded-2xl border border-border bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer px-5 text-lg"
                >
                  −
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer px-5 text-lg"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={
                  customizationUploading ||
                  customizationRemoving ||
                  !selectedCustomizations?.isValid ||
                  (product.productType === "variable" && !selectedVariant) ||
                  stock <= 0
                }
                onClick={handleAddToCart}
                className="flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart />

                {customizationUploading
                  ? "Uploading..."
                  : customizationRemoving
                    ? "Removing Image..."
                    : !selectedCustomizations?.isValid
                      ? "Complete Personalization"
                      : product.productType === "variable" && !selectedVariant
                        ? "Unavailable"
                        : stock <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
              </button>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="flex h-12 items-center justify-center rounded-2xl border border-border px-5 transition hover:scale-[1.02]"
              >
                <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              {product.description}
            </p>

            {/* Tags */}
            {!!product.tags?.length && (
              <div className="rounded-[2rem] border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold">Tags</h3>

                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="grid gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <FiTruck className="text-accent" />
                <span className="text-sm">Free Shipping</span>
              </div>

              <div className="flex items-center gap-3">
                <FiRefreshCw className="text-accent" />
                <span className="text-sm">Easy Returns</span>
              </div>

              <div className="flex items-center gap-3">
                <FiShield className="text-accent" />
                <span className="text-sm">Premium Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Mobile Bottom Bar */}
      <div className="fixed -bottom-0.5 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          {/* Quantity */}
          <div className="flex h-12 shrink-0 items-center rounded-2xl border border-border bg-card">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 text-lg"
            >
              −
            </button>

            <span className="w-10 text-center font-semibold">{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 text-lg"
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <button
            disabled={
              customizationUploading ||
              customizationRemoving ||
              !selectedCustomizations?.isValid ||
              (product.productType === "variable" && !selectedVariant) ||
              stock <= 0
            }
            onClick={handleAddToCart}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiShoppingCart className="shrink-0" />

            <span className="truncate">
              {customizationUploading
                ? "Uploading..."
                : customizationRemoving
                  ? "Removing..."
                  : !selectedCustomizations?.isValid
                    ? "Complete"
                    : product.productType === "variable" && !selectedVariant
                      ? "Unavailable"
                      : stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card"
          >
            <FiHeart
              className="text-lg"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </main>
  );
}
