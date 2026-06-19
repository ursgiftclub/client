'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
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
      toast.success('Thanks for subscribing!')
    }, 500)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90">
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Get Exclusive Offers
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Subscribe to our newsletter and be the first to know about new collections and special offers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 rounded-lg bg-primary-foreground text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition disabled:opacity-50 whitespace-nowrap"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-primary-foreground/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
