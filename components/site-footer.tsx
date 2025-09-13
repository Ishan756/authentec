export function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} AuthenTec. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-foreground">Privacy</a>
          <a href="/terms" className="hover:text-foreground">Terms</a>
          <a href="https://github.com/Ishan756/authentec" target="_blank" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
