"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiShoppingCart, FiUser } from "react-icons/fi";

import { useAppSelector } from "@/redux/hooks";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const cartTotal = useAppSelector((state) => state.cart.totalQuantity);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Hide on product details page
  const hideBar = pathname.startsWith("/product/");

  if (hideBar) return null;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: FiHome,
    },
    {
      label: "Categories",
      href: "/categories",
      icon: FiGrid,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: FiShoppingCart,
      badge: cartTotal,
    },
    {
      label: "Account",
      href: isAuthenticated ? "/profile" : "/login",
      icon: FiUser,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 transition ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />

                {item.badge > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-medium">{item.label}</span>

              {active && (
                <div className="absolute top-0 h-1 w-8 rounded-b-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
