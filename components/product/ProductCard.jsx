"use client";

import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";

import { playSound } from "@/lib/playSound";
import Image from "next/image";

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const productId = product._id || product.id;

  const isWishlisted = wishlistItems.some(
    (item) => (item._id || item.id) === productId,
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));

      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));

      playSound();

      toast.success("Added to wishlist!");
    }
  };

  // Price Logic
  const getPriceData = () => {
    // Variable Product
    if (product.productType === "variable" && product.variants?.length) {
      const prices = product.variants.map((v) => v.price);

      const minPrice = Math.min(...prices);

      const maxPrice = Math.max(...prices);

      return {
        isRange: minPrice !== maxPrice,
        price: minPrice,
        minPrice,
        maxPrice,
      };
    }

    // Simple Product
    return {
      isRange: false,
      price: product.price || 0,
      minPrice: product.price || 0,
      maxPrice: product.price || 0,
    };
  };

  const priceData = getPriceData();

  const discount = product.discount || 0;

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group h-full"
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={
                product.commonImages?.[0]?.url ||
                "https://placehold.co/600x600/1f1f1f/ffffff?text=No+Image"
              }
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            {/* Gradient Overlay */}

            {/* Discount */}
            {discount > 0 && (
              <div className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground shadow-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                -{discount}%
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 sm:right-3 sm:top-3 sm:h-10 sm:w-10 ${
                isWishlisted
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "bg-white/80 text-primary hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <FiHeart
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2 p-3 sm:p-4">
            {/* Category */}
            <p className="truncate text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
              {product.category?.name || product.category}
            </p>

            {/* Title */}
            <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground transition group-hover:text-primary sm:min-h-12 sm:text-base">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-1 pt-1 sm:gap-2">
              <span className="text-sm font-bold text-primary sm:text-lg">
                {priceData.isRange ? (
                  <>
                    ₹{priceData.minPrice}
                    {" - "}₹{priceData.maxPrice}
                  </>
                ) : (
                  <>₹{priceData.price}</>
                )}
              </span>

              {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through sm:text-sm">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Optional Stock */}
            {/* {product.stock === 0 && (
              <p className="text-[11px] font-medium text-red-500 sm:text-xs">
                Out of Stock
              </p>
            )} */}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
