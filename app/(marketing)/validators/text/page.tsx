"use client"

import { motion } from 'framer-motion'
import { TextValidation } from '@/components/text-validation'
import { FileText, Image as ImageIcon, Film, ExternalLink, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function TextValidatorPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Text Validation
          </h1>
          <p className="text-sm text-muted-foreground">Analyze text using Gemini or Claude. Get summaries, issues, and suggestions.</p>
        </div>
        <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          Back to features <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="px-2.5 py-1 rounded-full border border-white/10 bg-background/70">Providers: Gemini, Claude</span>
        <Link href="/validators/image" className="px-2.5 py-1 rounded-full border border-white/10 hover:bg-muted transition-colors inline-flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" /> Image
        </Link>
        <Link href="/validators/video" className="px-2.5 py-1 rounded-full border border-white/10 hover:bg-muted transition-colors inline-flex items-center gap-1">
          <Film className="h-3.5 w-3.5" /> Video
        </Link>
      </div>

      <div className="glass-card p-6 md:p-8 hover-glow max-w-4xl">
        <TextValidation />
      </div>

      <div className="glass-card p-5 mt-4 max-w-4xl">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 mt-0.5 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 text-foreground font-medium">Tips</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Short, factual paragraphs work best.</li>
              <li>Include context or source when possible.</li>
              <li>Compare providers to spot disagreements.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
