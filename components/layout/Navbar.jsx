"use client";

import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMobileMenu, closeMobileMenu } from "@/redux/slices/uiSlice";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);

  const itemCount = useAppSelector((state) => state.cart.itemCount);

  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const toggleMenu = () => {
    dispatch(toggleMobileMenu());
  };

  const closeMenu = () => {
    dispatch(closeMobileMenu());
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());

    dispatch(clearCart());

    closeMenu();

    toast.success("Logged out successfully");

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="font-bold text-lg text-foreground">
            URS Gift Club
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div className="relative group">
            <Link
              href="/categories"
              className="text-sm font-medium text-foreground hover:text-accent transition"
            >
              Categories
            </Link>

            {/* Dropdown */}
            <div className="invisible absolute left-0 top-full z-50 mt-3 w-64 rounded-xl border border-border bg-background p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col gap-1">
                <Link
                  href="/categories/birthday-gifts"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition "
                >
                  Birthday Gifts
                </Link>

                <Link
                  href="/categories/anniversary-gifts"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition "
                >
                  Anniversary Gifts
                </Link>

                <Link
                  href="/categories/for-him"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition "
                >
                  Gifts For Him
                </Link>

                <Link
                  href="/categories/for-her"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition "
                >
                  Gifts For Her
                </Link>

                <Link
                  href="/categories/personalized-gifts"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-secondary transition "
                >
                  Personalized Gifts
                </Link>

                <Link
                  href="/categories"
                  className="mt-2 px-3 py-2 text-sm font-medium text-accent"
                >
                  View All Categories →
                </Link>
              </div>
            </div>
          </div>

          {/* <Link
            href="/new-arrivals"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            New Arrivals
          </Link>

          <Link
            href="/offers"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            Offers
          </Link> */}

          <Link
            href="/about"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-foreground hover:text-accent transition"
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search */}
          <Link
            href="/search"
            className="hidden sm:flex p-2 rounded-lg hover:bg-secondary transition"
          >
            <FiSearch className="size-5 text-foreground" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-lg hover:bg-secondary transition"
            onClick={closeMenu}
          >
            <FiHeart className="size-5 text-foreground" />

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg hover:bg-secondary transition"
            onClick={closeMenu}
          >
            <FiShoppingCart className="size-5 text-foreground" />

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User */}
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className="hidden sm:flex p-2 rounded-lg hover:bg-secondary transition"
            onClick={closeMenu}
          >
            <FiUser className="size-5 text-foreground" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition"
          >
            {mobileMenuOpen ? (
              <FiX className="size-5 text-foreground" />
            ) : (
              <FiMenu className="size-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />

          {/* Menu */}
          <div className="fixed left-0 top-0 z-50 h-screen w-full bg-background md:hidden">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-lg font-bold text-foreground"></span>

              <button
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:bg-secondary"
              >
                <FiX className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-1 p-4">
              <Link
                href="/"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                Shop
              </Link>

              <Link
                href="/categories"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                Categories
              </Link>

              <Link
                href="/new-arrivals"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                New Arrivals
              </Link>

              <Link
                href="/offers"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                Offers
              </Link>

              <Link
                href="/about"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                About
              </Link>

              <Link
                href="/contact"
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                onClick={closeMenu}
              >
                Contact
              </Link>

              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="mt-3 rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              ) : (
                <button
                  // href="/login"
                  className="mt-3 rounded-xl bg-red-500 px-4 py-3 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
