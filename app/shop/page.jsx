import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop - Urs Gift Club",
  description:
    "Browse our collection of premium gifts. Filter by category, price, and sort by your preference.",
};

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;

  const category = params?.category || "";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <ShopClient initialCategory={category} />
      </div>
    </main>
  );
}
