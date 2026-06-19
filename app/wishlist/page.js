"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  removeFromWishlist,
  clearWishlist,
} from "@/redux/slices/wishlistSlice";
// import { addToCart } from '@/redux/slices/cartSlice'
import { FiTrash2, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    toast.success("All items added to cart!");
  };

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Save items to your wishlist to view them later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              <FiArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} items saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-medium"
            >
              <FiShoppingCart className="w-5 h-5" />
              Add All to Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={item} />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-4 right-4 p-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-full transition z-20"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <button
            onClick={handleAddAllToCart}
            className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition font-medium"
          >
            <FiShoppingCart className="w-5 h-5" />
            Add All to Cart
          </button>
        </div>

        <button
          onClick={() => dispatch(clearWishlist())}
          className="mt-4 sm:mt-0 block ml-auto text-muted-foreground hover:text-destructive transition text-sm"
        >
          Clear All
        </button>
      </div>
    </main>
  );
}
