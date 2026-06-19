'use client'

import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setEmail('')
      toast.success('Successfully subscribed to our newsletter!')
    }, 500)
  }

  return (
    <footer className="border-t border-border bg-secondary">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="mt-2 text-primary-foreground/80">Get exclusive offers and updates on new arrivals.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex-1 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded bg-primary-foreground text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded bg-accent" />
              <span className="font-bold text-foreground">Urs Gift Club</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium gifts for every occasion. Discover luxury, personalization, and unforgettable experiences.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <FiFacebook className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <FiInstagram className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <FiTwitter className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <FiLinkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-accent transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=luxury-gifts" className="text-sm text-muted-foreground hover:text-accent transition">
                  Luxury Gifts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=personalized" className="text-sm text-muted-foreground hover:text-accent transition">
                  Personalized
                </Link>
              </li>
              <li>
                <Link href="/shop?category=experiences" className="text-sm text-muted-foreground hover:text-accent transition">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-accent transition">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; 2024 Urs Gift Club. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
