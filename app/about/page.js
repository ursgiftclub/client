import Link from 'next/link'

export const metadata = {
  title: 'About Us - Urs Gift Club',
  description: 'Learn about Urs Gift Club and our commitment to premium gifting.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">About Urs Gift Club</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Urs Gift Club was founded with a simple mission: to make gifting exceptional. We believe
              every gift tells a story, and every occasion deserves something special. Our carefully
              curated collection brings together the finest luxury items, personalized options, and
              unforgettable experiences from around the world.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Values</h2>
            <ul className="space-y-3">
              {[
                'Quality: We never compromise on the quality of our products',
                'Authenticity: All items are 100% authentic from trusted sources',
                'Personalization: Every gift can be made uniquely yours',
                'Sustainability: We partner with eco-friendly and ethical suppliers',
                'Customer Focus: Your satisfaction is our priority',
              ].map((value, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="text-accent font-bold">✓</span>
                  {value}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              With Urs Gift Club, you get access to a hand-selected collection of premium gifts,
              expert curation, personalization services, and exceptional customer support. We handle
              everything from packaging to delivery, so you can focus on the joy of giving.
            </p>
          </section>

          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition mt-8"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
