"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const tiers = [
	{ name: 'Free', price: '$0', features: ['Local testing', 'Community support'], cta: 'Get Started' },
	{ name: 'Pro', price: '$19/mo', features: ['Unlimited validations', 'Priority support', 'Team seats'], cta: 'Upgrade' },
	{ name: 'Enterprise', price: 'Contact', features: ['SLA', 'Custom models', 'Security review'], cta: 'Contact Sales' },
]

export default function PricingPage() {
	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
			<section className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Pricing</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">Simple and transparent pricing for teams of all sizes.</p>
			</section>

			<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{tiers.map((t, i) => (
					<motion.div key={t.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
						<Card className="glass-card hover-glow">
							<CardHeader>
								<CardTitle>{t.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold mb-3">{t.price}</p>
								<ul className="space-y-2 text-sm text-muted-foreground mb-6">
									{t.features.map(f => <li key={f}>• {f}</li>)}
								</ul>
								<Button className="w-full">{t.cta}</Button>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
