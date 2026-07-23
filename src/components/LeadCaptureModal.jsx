import { useState, useEffect } from 'react'
import { X, ArrowRight, CheckCircle2 } from 'lucide-react'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

const LeadCaptureModal = () => {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Show modal after 2.5 s if not already dismissed this session
    const dismissed = sessionStorage.getItem('leadModalDismissed')
    if (dismissed) return
    const timer = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('leadModalDismissed', '1')
    setVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() && !email.trim() && !phone.trim()) {
      dismiss()
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        sheetName: 'Leads',
        type: 'lead_capture',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        source: 'website_popup',
        domain: typeof window !== 'undefined' ? window.location.hostname : '',
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
      setSubmitted(true)
      setTimeout(() => dismiss(), 2200)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-[fadeSlideUp_0.35s_ease-out]">
        <div className="relative bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

          {/* Close btn */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <CheckCircle2 size={44} className="text-green-400" />
                <p className="text-white text-lg font-semibold">Thank you!</p>
                <p className="text-white/50 text-sm">We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-2">
                  Stay Connected
                </p>
                <h2 className="text-2xl font-black tracking-tight uppercase italic text-white mb-1">
                  Let's <span className="text-red-500">Connect</span>
                </h2>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  Drop your details and we'll keep you updated on opportunities,
                  projects, and more. Totally optional — your call.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />

                  {error && (
                    <p className="text-red-400 text-xs">{error}</p>
                  )}

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? 'Sending…' : 'Submit'}
                      {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer text-center py-1"
                    >
                      No thanks, skip
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadCaptureModal
