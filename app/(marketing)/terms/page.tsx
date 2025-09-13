"use client"

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">By using AuthenTec you agree to our terms. Replace this stub with real terms for your deployment.</p>
    </motion.div>
  )
}
