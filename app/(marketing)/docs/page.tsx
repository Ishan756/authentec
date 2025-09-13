"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DocsPage() {
	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<section className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Documentation</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">Learn how to call the APIs and integrate AuthenTec in your workflows.</p>
			</section>
			<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
				<div className="glass-card p-6 hover-glow">
					<h2 className="font-semibold mb-2">Quick start</h2>
					<ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
						<li>Open a validator: Text, Image, or Video.</li>
						<li>Choose providers (Gemini, Claude).</li>
						<li>Submit content and review results.</li>
					</ol>
				</div>

				<div className="glass-card p-6 hover-glow">
					<h2 className="font-semibold mb-2">API endpoints</h2>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li><code>POST /api/validate-text</code> — Analyze text for issues.</li>
						<li><code>POST /api/validate-image</code> — Inspect an image.</li>
						<li><code>POST /api/validate-key</code> — Optional: sanity-check provider keys.</li>
					</ul>
				</div>

				<div className="glass-card p-6 hover-glow md:col-span-2">
					<h2 className="font-semibold mb-2">Source</h2>
					<p className="text-sm text-muted-foreground">See the source on <Link href="https://github.com/Ishan756/authentec" className="underline underline-offset-4">GitHub</Link>. Fork it and customize providers, prompts, or UI.</p>
				</div>
			</div>
		</motion.div>
	)
}
