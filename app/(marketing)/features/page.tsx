"use client"

import { motion } from 'framer-motion'
import { Shield, ScanLine, Camera, Sparkles, Bot, Code } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<section className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Features</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">Beautiful UI with multi-provider validation for text, image, and video. Built with performance and accessibility in mind.</p>
			</section>

					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{[
							{ icon: Shield, title: 'Reliable', desc: 'Robust parsing and error handling for messy LLM outputs.' },
							{ icon: ScanLine, title: 'Text Detector', desc: 'Validate factual accuracy with your chosen provider.' },
							{ icon: Camera, title: 'Image Detector', desc: 'Vision analysis with Gemini or Claude.' },
					{ icon: Sparkles, title: 'Animations', desc: 'Subtle motion powered by Framer Motion.' },
							{ icon: Bot, title: 'Providers', desc: 'Gemini and Claude supported.' },
					{ icon: Code, title: 'Modern Stack', desc: 'Next.js App Router, Tailwind, Radix, Shadcn UI.' },
				].map((f, i) => (
					<motion.div key={i} className="glass-card p-6 hover-glow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
						<f.icon className="h-6 w-6 text-primary mb-3" />
						<h3 className="font-semibold mb-1">{f.title}</h3>
						<p className="text-sm text-muted-foreground">{f.desc}</p>
					</motion.div>
				))}
			</div>

					<section className="mt-14 max-w-5xl mx-auto">
						<h2 className="text-xl font-semibold mb-4">Detectors</h2>
						<div className="grid md:grid-cols-3 gap-6">
							{[
								{ title: 'Text Validator', desc: 'Check text with Gemini or Claude.', href: '/validators/text' },
								{ title: 'Image Validator', desc: 'Analyze images for issues.', href: '/validators/image' },
								{ title: 'Video Validator', desc: 'Experimental video analysis.', href: '/validators/video' },
							].map((c, i) => (
								<Link key={c.href} href={c.href} className="glass-card p-6 hover-glow block">
									<motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
										<h3 className="font-semibold mb-1">{c.title}</h3>
										<p className="text-sm text-muted-foreground">{c.desc}</p>
									</motion.div>
								</Link>
							))}
						</div>
					</section>
		</motion.div>
	)
}
