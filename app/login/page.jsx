"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAppDispatch } from "@/redux/hooks";
import { login, register } from "@/redux/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { clearCart, setCart } from "@/redux/slices/cartSlice";
import { loadCart } from "@/lib/cartService";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // login default
  const [isLogin, setIsLogin] = useState(true);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
  };

  const mergeGuestCart = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || '{"items":[]}');

      if (!cart.items?.length) {
        return;
      }

      await axiosInstance.post("/cart/merge", {
        items: cart.items,
      });

      localStorage.removeItem("cart");
    } catch (error) {
      console.log("Cart merge failed", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // REGISTER
      if (!isLogin) {
        if (!formData.name) {
          toast.error("Please enter your name");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const { data } = await axiosInstance.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", data.token);

        dispatch(register(data.user));

        const cartData = await loadCart(true);

        dispatch(setCart(cartData));

        toast.success(data.message || "Account created successfully!");

        router.push("/");
      }

      // LOGIN
      else {
        const { data } = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        dispatch(login(data.user));

        localStorage.setItem("token", data.token);

        await mergeGuestCart();

        const cartData = await loadCart(true);

        dispatch(setCart(cartData));

        toast.success(data.message || "Login successful!");

        router.push("/");
      }

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
      });
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      toast.error(error.response?.data?.message || "Something went wrong!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
          {/* Top Toggle */}
          <div className="grid grid-cols-2 border-b border-border bg-secondary p-2">
            <button
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
              className={`rounded-xl py-3 text-sm font-semibold transition ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
              className={`rounded-xl py-3 text-sm font-semibold transition ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-muted-foreground">
                {isLogin
                  ? "Login to your Urs Gift Club account"
                  : "Join Urs Gift Club today"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground outline-none transition focus:border-primary"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground outline-none transition focus:border-primary"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-foreground outline-none transition focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground outline-none transition focus:border-primary"
                  />
                </div>
              )}

              {/* Login options */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-foreground">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-primary hover:underline">
                Terms
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-primary hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
