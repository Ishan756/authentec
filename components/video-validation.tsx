"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, Film, Upload, Play } from 'lucide-react'
import { toast } from 'sonner'

interface VideoValidationProps {}

interface VideoResult {
	provider: string
	isCorrect: boolean
	summary?: string
	correctedSummary?: string
	issues?: string[]
	confidence?: number
}

export function VideoValidation({}: VideoValidationProps) {
		const [selectedFile, setSelectedFile] = useState<File | null>(null)
		const [previewUrl, setPreviewUrl] = useState<string>('')
	const [validating, setValidating] = useState(false)
	const [results, setResults] = useState<VideoResult[]>([])
	const [selectedProviders, setSelectedProviders] = useState<string[]>([])

	const availableProviders = ['gemini','claude']

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (file) {
				setSelectedFile(file)
				setResults([])
				try { setPreviewUrl(URL.createObjectURL(file)) } catch {}
			}
	}

	const toggleProvider = (provider: string) => {
		setSelectedProviders(prev => prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider])
	}

	const handleValidate = async () => {
		if (!selectedFile) {
			toast.error('Please select a video file')
			return
		}
		if (selectedProviders.length === 0) {
			toast.error('Select at least one provider')
			return
		}

		setValidating(true)
		setResults([])

		try {
			// Demo placeholder: simulate processing
			const simulated: VideoResult[] = selectedProviders.map(p => ({
				provider: p,
				isCorrect: Math.random() > 0.4,
				summary: 'Detected topics: sample, placeholder, demo.',
				correctedSummary: 'Refined summary (demo).',
				issues: ['Demo issue A', 'Demo issue B'].slice(0, Math.random() > 0.5 ? 2 : 1),
				confidence: 0.6 + Math.random() * 0.35
			}))
			// Simulate latency
			await new Promise(r => setTimeout(r, 1100))
			setResults(simulated)
			if (simulated.every(r => r.isCorrect)) {
				toast.success('All providers validated the video')
			} else {
				toast.message('Some providers suggested corrections')
			}
		} catch (e) {
			toast.error('Video validation failed')
		} finally {
			setValidating(false)
		}
	}

	const getProviderDisplayName = (provider: string) => {
		const names: Record<string,string> = { openai: 'OpenAI', gemini: 'Gemini', claude: 'Claude', llama: 'LLaMA' }
		return names[provider] || provider
	}

	return (
		<div className="space-y-6">
					<Card className="overflow-hidden border border-white/10 bg-background/60 backdrop-blur">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Film className="h-5 w-5" />
						Video Validation
					</CardTitle>
					<CardDescription>Upload a short video for experimental analysis (demo).</CardDescription>
				</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-3">
								<Label htmlFor="video-input" className="text-sm font-medium">Video File</Label>
								<label htmlFor="video-input" className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-colors">
									<Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
									<p className="text-sm">{selectedFile ? 'Change video' : 'Click to upload a video'}</p>
									<input id="video-input" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
								</label>
								{selectedFile && (
									<div className="grid md:grid-cols-2 gap-4 items-start">
										{previewUrl && (
											<video src={previewUrl} controls className="w-full rounded-lg border border-white/10 shadow" />
										)}
										<div className="text-xs text-muted-foreground space-y-1">
											<p><span className="font-medium text-foreground">File:</span> {selectedFile.name}</p>
											<p><span className="font-medium text-foreground">Size:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
										</div>
									</div>
								)}
							</div>

					  <div className="space-y-2">
						<Label>Providers</Label>
						<div className="flex flex-wrap gap-3">
							{availableProviders.map(provider => {
								const active = selectedProviders.includes(provider)
								return (
									<button
										key={provider}
										type="button"
										onClick={() => toggleProvider(provider)}
								className={`px-3 py-1 rounded-md text-xs font-medium border transition-all hover:shadow ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-white/10'}`}
									>
										{getProviderDisplayName(provider)}
									</button>
								)
							})}
							{availableProviders.length === 0 && (
								<p className="text-xs text-muted-foreground">Configure API keys first.</p>
							)}
						</div>
					</div>

								<Button
						onClick={handleValidate}
						disabled={validating || !selectedFile || selectedProviders.length === 0}
									className="w-full h-11 group"
					>
						{validating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Analyzing...
							</>
									) : (
										<>
											<Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
											Validate Video
										</>
									)}
					</Button>
				</CardContent>
			</Card>

			{results.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Results</h3>
					{results.map((r, i) => (
						<Card key={i} className={`border-l-4 ${r.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>        
							<CardHeader className="pb-3 flex flex-row items-center justify-between">
								<CardTitle className="text-base flex items-center gap-2">
									{getProviderDisplayName(r.provider)}
								</CardTitle>
								<Badge variant={r.isCorrect ? 'default' : 'destructive'} className="flex items-center gap-1">
									{r.isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
									{r.isCorrect ? 'Valid' : 'Issues'}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-3 pt-0">
								{r.summary && (
									<div className="text-sm">
										<span className="font-medium">Summary:</span> {r.summary}
									</div>
								)}
								{!r.isCorrect && r.correctedSummary && (
									<div className="text-sm">
										<span className="font-medium text-orange-500">Suggested:</span> {r.correctedSummary}
									</div>
								)}
								{r.issues && r.issues.length > 0 && (
									<ul className="text-xs space-y-1">
										{r.issues.map((issue, idx) => (
											<li key={idx} className="flex items-center gap-1">
												<XCircle className="w-3 h-3 text-red-500" /> {issue}
											</li>
										))}
									</ul>
								)}
								{r.confidence !== undefined && (
									<p className="text-xs text-muted-foreground">Confidence: {(r.confidence * 100).toFixed(1)}%</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
