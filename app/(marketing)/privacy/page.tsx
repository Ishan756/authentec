"use client"

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">We don’t store your content or keys on our servers beyond what’s necessary to process a request. Review and adapt this text to your needs.</p>
    </motion.div>
  )
}
