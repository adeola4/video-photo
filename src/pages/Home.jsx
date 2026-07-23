import { useState, useEffect } from 'react'
import { Camera, Video, ArrowRight, MapPin, Clock, DollarSign, Briefcase, CheckCircle2, FileText, X, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import VideoBackground from '../components/VideoBackground'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
const CENTRAL_ENGINE_URL = import.meta.env.VITE_CENTRAL_ENGINE_URL

const Home = () => {
  const navigate = useNavigate()
  const { domain: pathDomain } = useParams()
  const currentDomain = pathDomain || (typeof window !== 'undefined' ? window.location.hostname : 'default-domain.com')

  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [showContractModal, setShowContractModal] = useState(false)
  const [contractSubmitting, setContractSubmitting] = useState(false)
  const [contractAccepted, setContractAccepted] = useState(false)
  const [contractError, setContractError] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setContractError('')
    setShowContractModal(true)
  }

  const handleAcceptContract = async () => {
    setContractSubmitting(true)
    setContractError('')
    try {
      const timestamp = new Date().toISOString()
      const payload = {
        sheetName: 'Contracts',
        type: 'contract_acceptance',
        email: email.trim(),
        domain: currentDomain,
        timestamp,
        accepted: true
      }

      const promises = []
      if (GOOGLE_SCRIPT_URL) {
        promises.push(fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        }))
      }
      if (CENTRAL_ENGINE_URL) {
        promises.push(fetch(CENTRAL_ENGINE_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            sheetName: 'Contracts',
            name: email.trim(),
            email: email.trim(),
            reason: 'Provisional Contract Acceptance',
            note: `Domain: ${currentDomain} | Accepted: true | Timestamp: ${timestamp}`
          })
        }))
      }
      await Promise.allSettled(promises)
      setContractAccepted(true)
    } catch {
      setContractError('Submission failed. Please try again.')
    } finally {
      setContractSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <VideoBackground />
        <div className="absolute inset-0 bg-[#161616]/85" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col text-[#FFFFF5]">
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative pt-12 pb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#FFFFF5]/60 mb-6">Global Creative Collective</p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 italic uppercase leading-none select-none">
            FOREIGN <span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 pr-6 md:pr-10 lg:pr-14">AFFAIRS</span><span className="absolute bottom-1.5 left-0 right-6 md:right-10 lg:right-14 h-[4px] md:h-[8px] bg-red-600" /></span>
          </h1>

          <p className="text-base md:text-xl text-[#FFFFF5]/70 max-w-2xl leading-relaxed mb-8">
            World-class visual storytellers for global brands. Join our elite creative team and start working on high-impact projects.
          </p>

          <div className="flex justify-center gap-8 mb-10 text-[#FFFFF5]/50 uppercase tracking-widest text-xs md:text-sm font-semibold">
            <span className="flex items-center gap-2"><Camera size={18} className="text-[#FFFFF5]/50" /> PHOTOGRAPHY</span>
            <span className="flex items-center gap-2"><Video size={18} className="text-[#FFFFF5]/50" /> VIDEOGRAPHY</span>
          </div>

          {/* 1 Email Input + 1 Submit Button Landing Component */}
          <div className="w-full max-w-md bg-zinc-950/80 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md shadow-2xl mb-12 animate-[fadeSlideUp_0.35s_ease-out]">
            <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-2">Fast-Track Partner Entry</p>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3">Apply & Review Agreement</h2>
            <p className="text-xs md:text-sm text-[#FFFFF5]/60 mb-6 leading-relaxed">
              Enter your email to inspect the provisional partner terms and confirm candidate placement.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/35 text-sm md:text-base focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-base transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-600/20"
              >
                Submit Application
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <button
            onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors cursor-pointer text-xs uppercase tracking-widest font-semibold"
          >
            Scroll Down
          </button>
        </div>

        <div id="openings" className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32 scroll-mt-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#FFFFF5]/60 mb-8">At Ease Healthcare Inc.</p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 italic leading-[1.1] uppercase">
            Photographer &<br />
            <span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 pr-4 md:pr-8">Videographer</span><span className="absolute bottom-1 left-0 right-4 md:right-8 h-[3px] md:h-[6px] bg-red-600" /></span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl font-semibold uppercase tracking-wider text-[#FFFFF5]/70 mb-6">Events & Photoshoots</p>

          <p className="text-lg md:text-2xl text-[#FFFFF5]/70 max-w-4xl leading-relaxed mb-6">
            Capture high-quality images and video that align with our brand identity and support our marketing and communication efforts. Work on corporate events, product shoots, promotional materials, and more.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 text-base md:text-lg">
            <div><DollarSign size={20} className="text-red-500 mb-1" /><div className="text-[#FFFFF5]/50 text-sm uppercase tracking-wider">Compensation</div><div className="font-semibold">$45k–$75k / year</div></div>
            <div><Briefcase size={20} className="text-red-500 mb-1" /><div className="text-[#FFFFF5]/50 text-sm uppercase tracking-wider">Job Type</div><div className="font-semibold">Full-time / Contract</div></div>
            <div><Clock size={20} className="text-red-500 mb-1" /><div className="text-[#FFFFF5]/50 text-sm uppercase tracking-wider">Schedule</div><div className="font-semibold">Flexible / Your hours</div></div>
            <div><MapPin size={20} className="text-red-500 mb-1" /><div className="text-[#FFFFF5]/50 text-sm uppercase tracking-wider">Location</div><div className="font-semibold">Remote / Hybrid / On-site</div></div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Position Overview</h2>
            <p className="text-[#FFFFF5]/70 text-lg md:text-xl leading-relaxed max-w-4xl">
              As our Photographer & Videographer, you will play a key role in capturing high-quality visual content that aligns with our brand identity and supports our marketing and communication efforts. You will work on a variety of projects including corporate events, product photoshoots, promotional materials, and more. This role requires creativity, technical expertise, and the ability to adapt to diverse settings and timelines.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Responsibilities</h2>
            <ul className="space-y-3 text-zinc-400 text-lg md:text-xl leading-relaxed">
              {[
                'Capture professional-grade photographs and video for events, campaigns, social media, and internal communications.',
                'Collaborate with marketing and creative teams to understand project requirements and deliver compelling content.',
                'Edit and retouch images and footage to meet quality standards and brand guidelines.',
                'Manage equipment and ensure all gear is well-maintained and ready for use.',
                'Travel to event locations and photoshoot sites as needed, ensuring timely setup and execution.',
                'Maintain an organized digital asset library with proper tagging and archiving.',
                'Stay current on industry trends, tools, and techniques to continually improve your work.',
                'Work efficiently in fast-paced environments with tight deadlines.',
                'Provide creative direction and suggest innovative ideas for visual storytelling.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3"><span className="text-red-500 mt-2 shrink-0 w-2 h-2 rounded-full bg-red-500" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Requirements</h2>
            <ul className="space-y-3 text-zinc-400 text-lg md:text-xl leading-relaxed">
              {[
                'Proven experience with a strong portfolio showcasing event, portrait, and commercial work.',
                'Proficiency in editing software (Lightroom, Photoshop, Premiere Pro, DaVinci Resolve).',
                'Ability to start immediately and perform at a high level in fast-paced environments.',
                'Strong understanding of lighting, composition, and post-production techniques.',
                'Excellent organizational skills with the ability to manage multiple projects simultaneously.',
                'Proficiency with DSLR/mirrorless cameras and related equipment.',
                'Ability to work independently and as part of a team.',
                'Strong communication skills with the ability to take direction and provide creative input.',
                'Reliable transportation and willingness to travel locally for events and shoots.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3"><span className="text-red-500 mt-2 shrink-0 w-2 h-2 rounded-full bg-red-500" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Benefits</h2>
            <div className="space-y-2 text-[#FFFFF5]/70 text-lg md:text-xl">
              {['Full benefit package available at hiring', 'Flexible schedule', 'Opportunities for professional development and growth'].map((b) => (
                <div key={b} className="flex items-center gap-3"><CheckCircle2 size={20} className="text-green-500 shrink-0" />{b}</div>
              ))}
            </div>
          </section>
        </div>

        <div className={`fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 pb-6 px-6 flex justify-center transition-all duration-500 transform ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <button onClick={() => navigate('/apply')} className="group inline-flex items-center gap-3 px-10 md:px-14 py-4 md:py-5 bg-white text-black font-bold rounded-full text-lg md:text-xl hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer shadow-2xl">
            Ok, Continue
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Provisional Contract Modal / Overlay */}
      {showContractModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowContractModal(false)} />

          <div className="relative z-10 w-full max-w-2xl bg-[#0f0f0f] border border-white/15 rounded-2xl overflow-hidden shadow-2xl animate-[fadeSlideUp_0.35s_ease-out]">
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

            <button
              onClick={() => setShowContractModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8">
              {contractAccepted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Provisional Contract Accepted</h3>
                  <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                    Your acceptance has been logged for <strong className="text-white">{email}</strong> on domain <strong className="text-white">{currentDomain}</strong>.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => navigate('/apply')}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Complete Full Application Profile
                    </button>
                    <button
                      onClick={() => setShowContractModal(false)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={22} className="text-red-500" />
                    <p className="text-xs font-semibold tracking-widest uppercase text-white/40">Provisional Agreement</p>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mb-2">
                    Independent Creative Partner Terms
                  </h3>
                  <p className="text-white/50 text-xs md:text-sm mb-4">
                    Domain: <span className="text-white font-mono">{currentDomain}</span> | Email: <span className="text-white font-mono">{email}</span>
                  </p>

                  <div className="bg-black/60 border border-white/10 rounded-xl p-4 md:p-5 h-64 overflow-y-auto text-xs md:text-sm text-zinc-300 space-y-3 leading-relaxed mb-6 custom-scrollbar">
                    <p className="font-bold text-white uppercase text-xs tracking-wider">1. Engagement & Scope</p>
                    <p>
                      This Provisional Independent Contractor Agreement governs the initial placement of the creative partner (Email: {email}) with At Ease Healthcare Inc. / Foreign Affairs Creative Collective across designated assignment domains ({currentDomain}).
                    </p>
                    <p className="font-bold text-white uppercase text-xs tracking-wider">2. Compensation & Terms</p>
                    <p>
                      Independent partner shall be eligible for per-assignment or contract milestone pay ranging from $45,000 to $75,000 annual equivalent, determined by event scale, location, and technical requirements.
                    </p>
                    <p className="font-bold text-white uppercase text-xs tracking-wider">3. Confidentiality & Image Standard</p>
                    <p>
                      Partner agrees to uphold client confidentiality, maintain professional conduct standards, and refrain from publishing unapproved raw client assets prior to written release.
                    </p>
                    <p className="font-bold text-white uppercase text-xs tracking-wider">4. Electronic Acceptance & Verification</p>
                    <p>
                      By clicking "I Accept & Sign Contract", candidate confirms assent to these provisional terms. A record containing email, domain, timestamp, and acceptance flag will be securely recorded.
                    </p>
                  </div>

                  {contractError && <p className="text-red-400 text-xs mb-3">{contractError}</p>}

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowContractModal(false)}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white/70 font-medium rounded-xl text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptContract}
                      disabled={contractSubmitting}
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-60"
                    >
                      {contractSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Logging Acceptance...
                        </>
                      ) : (
                        'I Accept & Sign Contract'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

