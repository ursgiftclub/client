'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent! We will be in touch soon.')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: '📧',
              title: 'Email',
              value: 'support@ursgiftclub.com',
            },
            {
              icon: '📱',
              title: 'Phone',
              value: '+1 (555) 123-4567',
            },
            {
              icon: '📍',
              title: 'Address',
              value: '123 Gift Street, Luxury City, LC 12345',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-center p-6 bg-secondary rounded-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-secondary border border-border rounded-lg p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground resize-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </main>
  )
}
