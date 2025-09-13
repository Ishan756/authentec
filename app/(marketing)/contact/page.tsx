"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
	const [submitted, setSubmitted] = useState(false)
	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<section className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Contact</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">Have a question or feature request? Send a message.</p>
			</section>

			<div className="max-w-2xl mx-auto">
				{submitted ? (
						<motion.div className="glass-card p-8 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
							<p className="text-green-500 font-medium">Thanks! We&apos;ll get back to you soon.</p>
						</motion.div>
				) : (
					<Card className="glass-card hover-glow">
						<CardHeader>
							<CardTitle>Send a message</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Input placeholder="Your name" />
							<Input placeholder="Email" type="email" />
							<Textarea placeholder="Message" rows={5} />
							<Button className="w-full" onClick={() => setSubmitted(true)}>Submit</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</motion.div>
	)
}
