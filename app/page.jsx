import HeroSlider from "@/components/home/HeroSlider";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata = {
  title: "Urs Gift Club - Premium Gifts for Every Occasion",
  description:
    "Discover luxury gifts, personalized gifts, and unforgettable experiences. Urs Gift Club offers premium gifting solutions for all occasions.",
  keywords:
    "gifts, luxury gifts, personalized gifts, premium gifts, gift delivery",
  openGraph: {
    title: "Urs Gift Club - Premium Gifts",
    description:
      "Discover luxury gifts and personalized options at Urs Gift Club",
  },
};


export default function Home() {
  const testAuth = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    alert(JSON.stringify(data));
  } catch (error) {
    alert(
      JSON.stringify(
        error.response?.data || error.message
      )
    );
  }
};
  return (
    <main>
      <button onClick={testAuth}>
  Test Auth
</button>

      <HeroSlider />
      <FeaturedCategories />
      <BestSellers />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
