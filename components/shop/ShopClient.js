"use client";

import { useState, useMemo, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { FiFilter, FiX } from "react-icons/fi";

import { motion } from "framer-motion";

import ProductCard from "@/components/product/ProductCard";
import axiosInstance from "@/lib/axios";

export default function ShopClient({ initialCategory = "" }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const queryCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || queryCategory,
  );

  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [priceRange, setPriceRange] = useState([0, 100000]);

  const [sortBy, setSortBy] = useState("popular");

  // Sync URL category
  useEffect(() => {
    setSelectedCategory(queryCategory);
  }, [queryCategory]);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");

        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        let url = "/products";

        if (selectedCategory) {
          url = `/products?category=${selectedCategory}`;
        }

        const { data } = await axiosInstance.get(url);

        setProducts(data.products || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [selectedCategory]);

  // Change category + URL
  const handleCategoryChange = (slug) => {
    const params = new URLSearchParams(searchParams);

    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }

    router.push(params.toString() ? `/shop?${params.toString()}` : "/shop", {
      scroll: false,
    });

    setSelectedCategory(slug);

    setShowFilters(false);
  };

  // Filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;

      default:
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return result;
  }, [products, searchQuery, priceRange, sortBy]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-border bg-background transition-transform duration-300 lg:relative lg:z-auto lg:w-72 lg:translate-x-0 ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-5 lg:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>

          <button onClick={() => setShowFilters(false)}>
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8 p-5">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium">Search</label>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 font-semibold">Categories</h3>

            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full rounded-xl px-4 py-3 text-left transition ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full rounded-xl px-4 py-3 text-left transition ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name
                : "All Products"}
            </h1>

            <p className="text-muted-foreground">
              {filteredProducts.length} products
            </p>
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 lg:hidden"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">Loading...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
