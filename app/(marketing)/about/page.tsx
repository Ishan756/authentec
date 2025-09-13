"use client"

import { motion } from 'framer-motion'

export default function AboutPage() {
	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<section className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">About AuthenTec</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">AuthenTec helps you validate content across modalities with multiple AI providers, wrapped in a clean, professional UI.</p>
			</section>

			<div className="glass-card p-6 md:p-8 hover-glow max-w-3xl mx-auto">
				<div className="prose prose-invert">
					<p>We believe trustworthy content is essential. AuthenTec provides a simple, unified interface to check text, images, and videos using leading language and vision models for consistent, structured results.</p>
					<p>This project uses Next.js App Router, Tailwind CSS, Framer Motion animations, and Shadcn UI components. It’s designed to be fast, accessible, and delightful to use.</p>
				</div>
			</div>

			<div className="grid md:grid-cols-3 gap-4 mt-8 max-w-5xl mx-auto">
				{[
					{ title: 'Simple', desc: 'Clean workflows with clear results.' },
					{ title: 'Reliable', desc: 'Parsing and guards for messy outputs.' },
					{ title: 'Performant', desc: 'Built on a modern, optimized stack.' },
				].map((v, i) => (
					<motion.div key={i} className="glass-card p-5 hover-glow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
						<h3 className="font-semibold mb-1">{v.title}</h3>
						<p className="text-sm text-muted-foreground">{v.desc}</p>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
