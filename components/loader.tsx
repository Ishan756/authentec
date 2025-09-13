"use client"

import { motion } from 'framer-motion'

export function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="relative h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-t-2 border-b-2 border-primary"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
