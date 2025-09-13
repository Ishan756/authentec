import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import '../globals.css'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
