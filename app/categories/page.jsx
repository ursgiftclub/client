import Link from "next/link";
import { FiGift, FiHeart, FiUsers, FiStar } from "react-icons/fi";

const occasionCategories = [
  {
    title: "Birthday Gifts",
    href: "/categories/birthday-gifts",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
  },
  {
    title: "Anniversary Gifts",
    href: "/categories/anniversary-gifts",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
  },
  {
    title: "Wedding Gifts",
    href: "/categories/wedding-gifts",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
  },
  {
    title: "Festival Gifts",
    href: "/categories/festival-gifts",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800",
  },
];

const personCategories = [
  "Gifts For Him",
  "Gifts For Her",
  "Parents",
  "Friends",
  "Couples",
  "Kids",
];

const trendingCategories = [
  "Personalized Gifts",
  "Luxury Gifts",
  "Photo Gifts",
  "Corporate Gifts",
  "Handmade Gifts",
  "Premium Hampers",
];

export default function CategoriesPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center md:px-6">
          <div className="mb-4 flex justify-center">
            <FiGift className="size-10 text-accent" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Find the Perfect Gift
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore unique gifts for birthdays, anniversaries, loved ones, and
            every special moment.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Occasion Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-center gap-3">
          <FiHeart className="size-6 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">
            Shop by Occasion
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {occasionCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Person */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-center gap-3">
            <FiUsers className="size-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">
              Shop by Person
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
            {personCategories.map((item) => (
              <Link
                key={item}
                href={`/categories/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-2xl border border-border bg-card p-6 text-center font-medium transition hover:border-accent hover:shadow-md"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-center gap-3">
          <FiStar className="size-6 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">
            Trending Categories
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          {trendingCategories.map((item) => (
            <Link
              key={item}
              href={`/categories/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:border-accent hover:bg-accent hover:text-primary-foreground"
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-[2rem] bg-accent p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">
            Free Shipping on Orders Above ₹999
          </h2>

          <p className="mt-3 opacity-90">
            Surprise your loved ones with beautiful gifts.
          </p>
        </div>
      </section>

      {/* SEO Section */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="text-2xl font-bold text-foreground">
            Buy Gifts Online at URS Gift Club
          </h2>

          <p className="mt-4 text-muted-foreground">
            Discover thoughtful gifts for every celebration — birthdays,
            anniversaries, weddings, festivals, and personalized moments. Shop
            premium curated gifts online at URS Gift Club.
          </p>
        </div>
      </section>
    </main>
  );
}
