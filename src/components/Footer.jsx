import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const currentYear = new Date().getFullYear()

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const payload = {
        sheetName: 'Newsletter',
        type: 'newsletter_signup',
        email: email.trim(),
        source: 'footer',
        timestamp: new Date().toISOString(),
      }
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="relative border-t border-white/8 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Brand */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
              Global Creative Collective
            </p>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-4">
              Foreign{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                  Affairs
                </span>
                <span className="absolute bottom-0.5 left-0 right-0 h-[3px] bg-red-600" />
              </span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              World-class visual storytellers for global brands. Based everywhere.
              Shooting everything.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
              Stay in the loop
            </p>
            <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
              Get <span className="text-red-500">Opportunities</span> First
            </h4>
            <p className="text-white/40 text-sm mb-5 leading-relaxed">
              New gigs, creative briefs, and behind-the-scenes updates — straight to your inbox.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 size={18} />
                <span>You're on the list. Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/30 transition-colors min-w-0"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group flex items-center gap-1.5 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-60 shrink-0"
                >
                  {status === 'loading' ? '…' : (
                    <>
                      Join
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/25 text-xs">
          <span>© {currentYear} At Ease Healthcare Inc. All rights reserved.</span>
          <span className="uppercase tracking-widest">Foreign Affairs Creative</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
