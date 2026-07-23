import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Globe, CheckCircle2, Mail, Loader2, ArrowRight, ChevronLeft
} from 'lucide-react'
import VideoBackground from '../components/VideoBackground'

const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
const CALENDLY_LINK = import.meta.env.VITE_CALENDLY_LINK
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL

const TOTAL_STEPS = 8

const INITIAL_FORM = {
  fullName: '', email: '', phone: '', website: '', socials: '',
  homeCityState: '', airportCode: '', passportStatus: '', passportExpiry: '',
  willingTravel: '', role: '', specialtyGenre: '', specialtyGenreOther: '',
  portfolioPrimary: '', portfolioSecondary: '', yearsExp: '', estEvents: '',
  corporateExp: '', corporateExpDetails: '',
  cameraBody1: '', cameraBody2: '', cameraBody3: '', primaryLenses: '',
  lightingKit: '', stabilizerGimbal: '', stabilizerGimbalModel: '',
  stabilizerTripod: '', stabilizerTripodModel: '', stabilizerSlider: '',
  droneModel: '', dronePart107: '', droneWaiver: '',
  audioMic: '', audioBoom: '', audioRecorder: '',
  desktopSpecs: '', laptopSpecs: '', monitorSpecs: '',
  noticeWindow: '', shiftDaytime: false, shiftEvening: false,
  shiftLateNight: false, shiftWeekend: false, shiftHoliday: false,
  shiftUrgent: false, estEventsPerMonth: '',
  conductStanding: 5, conductCalm: 5, conductDirection: 5,
  conductDress: 5, conductNoPost: 5, scenarioRawFiles: '',
  reqWiredInternet: false, reqSla48h: false, reqFollowUpInterview: false,
  reqPreferredWindow: '', signCandidateName: '', signCandidateSignature: '',
  signCandidateDate: '', signCandidateTimeSlot: ''
}

const Apply = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [errors, setErrors] = useState({})

  const scrollTop = () => window.scrollTo(0, 0)
  const goNext = () => { scrollTop(); setStep((s) => s + 1) }
  const goBack = () => { scrollTop(); setStep((s) => s - 1) }

  const setF = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const inputClass = "w-full bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 md:p-5 focus:outline-none focus:border-red-500 transition-colors text-[#FFFFF5] placeholder-zinc-600 text-base md:text-lg"
  const inputErrorClass = "w-full bg-zinc-900/80 border border-red-500 rounded-xl p-4 md:p-5 focus:outline-none focus:border-red-500 transition-colors text-[#FFFFF5] placeholder-zinc-600 text-base md:text-lg"
  const labelClass = "text-xs md:text-sm uppercase tracking-wider text-[#FFFFF5]/60 mb-2 block font-semibold"
  const btnClass = (active) => `py-3 px-4 rounded-xl border transition-all cursor-pointer text-sm md:text-base font-medium flex items-center justify-center text-center min-h-[58px] md:min-h-[64px] ${active ? 'bg-red-600 border-red-600 text-[#FFFFF5]' : 'bg-zinc-900/80 border-zinc-700 text-[#FFFFF5]/50 hover:border-zinc-500'}`

  const VALIDATORS = {
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email (e.g., name@domain.com)',
    phone: (v) => !v || /^[\d\s\-()+]{7,20}$/.test(v) ? '' : 'Enter a valid phone number (e.g., +1 (555) 123-4567)',
    website: (v) => !v || /^https?:\/\/.+/.test(v) ? '' : 'URL must start with http:// or https://',
    portfolioPrimary: (v) => !v || /^https?:\/\/.+/.test(v) ? '' : 'URL must start with http:// or https://',
    portfolioSecondary: (v) => !v || /^https?:\/\/.+/.test(v) ? '' : 'URL must start with http:// or https://',
    airportCode: (v) => !v || /^[A-Za-z]{2,4}$/.test(v) ? '' : 'Enter a valid airport code (e.g., LAX)',
    passportExpiry: (v) => !v || /^\d{2}\/\d{2}\/\d{4}$/.test(v) ? '' : 'Use MM/DD/YYYY format (e.g., 12/31/2030)',
    yearsExp: (v) => !v || Number(v) > 0 ? '' : 'Must be a positive number',
    estEvents: (v) => !v || Number(v) > 0 ? '' : 'Must be a positive number',
  }

  const validateStep = (fields) => {
    const newErrors = {}
    let valid = true
    fields.forEach((field) => {
      if (VALIDATORS[field]) {
        const err = VALIDATORS[field](form[field])
        if (err) { newErrors[field] = err; valid = false }
      }
    })
    setErrors(newErrors)
    return valid
  }

  const sendToDiscord = async (payload) => {
    if (!DISCORD_WEBHOOK_URL) return
    const rl = payload.role === 'photo' ? 'Photographer' : payload.role === 'video' ? 'Videographer' : 'Both'
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `New Screening Application — ${rl}`,
          color: payload.role === 'photo' ? 0x3b82f6 : payload.role === 'video' ? 0xef4444 : 0x8b5cf6,
          fields: [
            { name: 'Name', value: payload.fullName, inline: true }, { name: 'Email', value: payload.email, inline: true },
            { name: 'Phone', value: payload.phone || 'N/A', inline: true }, { name: 'Role', value: rl, inline: true },
            { name: 'Location', value: `${payload.homeCityState} (${payload.airportCode})`, inline: true },
            { name: 'Portfolio', value: payload.website || 'N/A', inline: true },
            { name: 'Interview', value: payload.signCandidateTimeSlot || 'TBD', inline: true }
          ], timestamp: new Date().toISOString(),
        }],
      }),
    })
  }

  const sendToSheets = async (payload) => {
    if (!GOOGLE_SCRIPT_URL) return
    await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ...payload }) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try { await Promise.allSettled([sendToDiscord(form), sendToSheets(form)]) } catch { setSubmitError('Something went wrong. Your application has been noted regardless.') }
    setSubmitting(false)
    scrollTop()
    setStep(TOTAL_STEPS + 1)
    if (CALENDLY_LINK) window.open(CALENDLY_LINK, '_blank', 'noopener,noreferrer')
  }

  const handleReturnHome = () => { scrollTop(); navigate('/') }

  // ─── SUCCESS ───
  if (step === TOTAL_STEPS + 1) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-[#FFFFF5] px-6 bg-black">
        <div className="fixed inset-0 pointer-events-none">
          <VideoBackground />
          <div className="absolute inset-0 bg-[#161616]/85" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-8 mx-auto"><CheckCircle2 size={48} className="text-green-500" /></div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase">Application Sent</h2>
          <p className="text-[#FFFFF5]/70 text-lg md:text-xl mb-8 leading-relaxed">Thank you for applying. Our team is reviewing your work and will be in touch soon.</p>
          {CALENDLY_LINK && <p className="text-[#FFFFF5]/50 text-base mb-8 leading-relaxed">A new tab opened with our booking link — schedule a quick call so we can get to know you better.</p>}
          <button onClick={handleReturnHome} className="px-10 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#FFFFF5]/70 text-base font-medium transition-colors cursor-pointer">Return Home</button>
          <div className="flex justify-center gap-8 mt-8"><InstagramIcon size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /><Globe size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /><Mail size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black min-h-screen text-[#FFFFF5]">
      <div className="fixed inset-0 pointer-events-none">
        <VideoBackground />
        <div className="absolute inset-0 bg-[#161616]/85" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-20 h-1 bg-zinc-900">
          <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-16 pb-32">
          {step === 1 ? (
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors mb-8 text-base cursor-pointer">
              <ChevronLeft size={20} /> Back
            </button>
          ) : (
            <button onClick={goBack} className="flex items-center gap-2 text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors mb-8 text-base cursor-pointer">
              <ChevronLeft size={20} /> Back
            </button>
          )}

          <h2 className="text-3xl md:text-4xl font-bold italic uppercase tracking-tight mb-2">
            {step === 1 && 'Contact & Identity'}
            {step === 2 && 'Primary Specialty & Portfolio'}
            {step === 3 && 'Years & Volume'}
            {step === 4 && 'Core Gear Overview'}
            {step === 5 && 'Basic Availability'}
            {step === 6 && 'Professional Conduct Self-Assessment'}
            {step === 7 && 'Scenario Check'}
            {step === 8 && 'Minimum Requirements Confirmation & Sign-Off'}
          </h2>
          <p className="text-[#FFFFF5]/50 text-base md:text-lg mb-10">Step {step} of {TOTAL_STEPS}</p>

          <form onSubmit={step === TOTAL_STEPS ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && (
              <div className="space-y-10 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className={labelClass}>Full Name *</label><input type="text" placeholder="Jane Doe" className={inputClass} value={form.fullName} onChange={setF('fullName')} required /></div>
                  <div className="space-y-2"><label className={labelClass}>Email Address *</label><input type="email" placeholder="jane@example.com" className={`${form.email && errors.email ? inputErrorClass : inputClass}`} value={form.email} onChange={setF('email')} required />{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}</div>
                  <div className="space-y-2"><label className={labelClass}>Phone Number *</label><input type="tel" placeholder="+1 (555) 123-4567" className={`${form.phone && errors.phone ? inputErrorClass : inputClass}`} value={form.phone} onChange={setF('phone')} required />{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}</div>
                  <div className="space-y-2"><label className={labelClass}>Website/Portfolio URL *</label><input type="url" placeholder="https://janedoe.com" className={`${form.website && errors.website ? inputErrorClass : inputClass}`} value={form.website} onChange={setF('website')} required />{errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}</div>
                  <div className="space-y-2"><label className={labelClass}>Instagram / Vimeo / Behance *</label><input type="text" placeholder="@janedoe or link" className={inputClass} value={form.socials} onChange={setF('socials')} required /></div>
                  <div className="space-y-2"><label className={labelClass}>Home Base City, State *</label><input type="text" placeholder="Los Angeles, CA" className={inputClass} value={form.homeCityState} onChange={setF('homeCityState')} required /></div>
                  <div className="space-y-2 md:col-span-2"><label className={labelClass}>Nearest Major Airport Code *</label><input type="text" placeholder="LAX" className={`${form.airportCode && errors.airportCode ? inputErrorClass : inputClass}`} value={form.airportCode} onChange={setF('airportCode')} required />{errors.airportCode && <p className="text-red-500 text-sm mt-1">{errors.airportCode}</p>}</div>
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>Passport *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[['valid', 'Valid Passport'], ['realid', 'Real ID / Enhanced ID'], ['none', 'None / Expired']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, passportStatus: val }))} className={btnClass(form.passportStatus === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                {form.passportStatus === 'valid' && (
                  <div className="space-y-2 animate-slideDown">
                    <label className={labelClass}>Passport Expiration Date (MM/DD/YYYY) *</label>
                    <input type="text" placeholder="12/31/2030" className={`${form.passportExpiry && errors.passportExpiry ? inputErrorClass : inputClass}`} value={form.passportExpiry} onChange={setF('passportExpiry')} required />
                    {errors.passportExpiry && <p className="text-red-500 text-sm mt-1">{errors.passportExpiry}</p>}
                  </div>
                )}

                <div className="space-y-3">
                  <label className={labelClass}>Willingness to travel *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['local', 'Local only'], ['regional', 'Regional'], ['domestic', 'Domestic / National'], ['international', 'International']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, willingTravel: val }))} className={btnClass(form.willingTravel === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={() => { if (validateStep(['email', 'phone', 'website', 'airportCode', 'passportExpiry'])) goNext() }} disabled={!form.fullName || !form.email || !form.phone || !form.website || !form.socials || !form.homeCityState || !form.airportCode || !form.passportStatus || (form.passportStatus === 'valid' && !form.passportExpiry) || !form.willingTravel} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 md:space-y-12">
                <div className="space-y-3">
                  <label className={labelClass}>Primary Discipline *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[['photo', 'Photographer'], ['video', 'Videographer / Cinematographer'], ['both', 'Both equally']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, role: val }))} className={btnClass(form.role === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Main Specialty / Genre *</label>
                  <select className={inputClass} value={form.specialtyGenre} onChange={setF('specialtyGenre')} required>
                    <option value="" className="bg-zinc-900 text-[#FFFFF5]/50">-- Select Specialty --</option>
                    <option value="event_corp" className="bg-zinc-900 text-[#FFFFF5]">Event — corporate / conference / gala</option>
                    <option value="event_social" className="bg-zinc-900 text-[#FFFFF5]">Event — social / wedding / private celebration</option>
                    <option value="commercial" className="bg-zinc-900 text-[#FFFFF5]">Commercial / advertising / product</option>
                    <option value="portrait" className="bg-zinc-900 text-[#FFFFF5]">Portrait / headshot / lifestyle</option>
                    <option value="editorial" className="bg-zinc-900 text-[#FFFFF5]">Editorial / fashion / publication</option>
                    <option value="food" className="bg-zinc-900 text-[#FFFFF5]">Food / beverage / hospitality</option>
                    <option value="architectural" className="bg-zinc-900 text-[#FFFFF5]">Architectural / interior / real estate</option>
                    <option value="automotive" className="bg-zinc-900 text-[#FFFFF5]">Automotive</option>
                    <option value="sports" className="bg-zinc-900 text-[#FFFFF5]">Sports / action</option>
                    <option value="broadcast" className="bg-zinc-900 text-[#FFFFF5]">Broadcast / live streaming</option>
                    <option value="documentary" className="bg-zinc-900 text-[#FFFFF5]">Documentary / film / indie</option>
                    <option value="social_first" className="bg-zinc-900 text-[#FFFFF5]">Social-first / short-form / Reels / TikTok</option>
                    <option value="music_video" className="bg-zinc-900 text-[#FFFFF5]">Music video / entertainment</option>
                    <option value="educational" className="bg-zinc-900 text-[#FFFFF5]">Educational / instructional</option>
                    <option value="fine_art" className="bg-zinc-900 text-[#FFFFF5]">Fine art / print</option>
                    <option value="photojournalism" className="bg-zinc-900 text-[#FFFFF5]">Photojournalism / editorial documentary</option>
                    <option value="other" className="bg-zinc-900 text-[#FFFFF5]">Other</option>
                  </select>
                </div>

                {form.specialtyGenre === 'other' && (
                  <div className="space-y-2 animate-slideDown">
                    <label className={labelClass}>Specify Specialty *</label>
                    <input type="text" placeholder="Please specify your specialty" className={inputClass} value={form.specialtyGenreOther} onChange={setF('specialtyGenreOther')} required />
                  </div>
                )}

                <div className="space-y-6 pt-4">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 mb-2">Portfolio Links for Specialty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Primary work sample URL *</label>
                      <input type="url" placeholder="https://..." className={`${form.portfolioPrimary && errors.portfolioPrimary ? inputErrorClass : inputClass}`} value={form.portfolioPrimary} onChange={setF('portfolioPrimary')} required />
                      {errors.portfolioPrimary && <p className="text-red-500 text-sm mt-1">{errors.portfolioPrimary}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Secondary work sample URL *</label>
                      <input type="url" placeholder="https://..." className={`${form.portfolioSecondary && errors.portfolioSecondary ? inputErrorClass : inputClass}`} value={form.portfolioSecondary} onChange={setF('portfolioSecondary')} required />
                      {errors.portfolioSecondary && <p className="text-red-500 text-sm mt-1">{errors.portfolioSecondary}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={() => { if (validateStep(['portfolioPrimary', 'portfolioSecondary'])) goNext() }} disabled={!form.role || !form.specialtyGenre || (form.specialtyGenre === 'other' && !form.specialtyGenreOther) || !form.portfolioPrimary || !form.portfolioSecondary} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 md:space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className={labelClass}>Years actively shooting professionally *</label><input type="number" placeholder="5" className={inputClass} value={form.yearsExp} onChange={setF('yearsExp')} required />{errors.yearsExp && <p className="text-red-500 text-sm mt-1">{errors.yearsExp}</p>}</div>
                  <div className="space-y-2"><label className={labelClass}>Approximate events/assignments completed *</label><input type="number" placeholder="100" className={inputClass} value={form.estEvents} onChange={setF('estEvents')} required />{errors.estEvents && <p className="text-red-500 text-sm mt-1">{errors.estEvents}</p>}</div>
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>Have you worked in healthcare, financial, or corporate environments? *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, corporateExp: val }))} className={btnClass(form.corporateExp === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                {form.corporateExp === 'yes' && (
                  <div className="space-y-2 animate-slideDown">
                    <label className={labelClass}>Describe the setting / context *</label>
                    <textarea rows={3} placeholder="Describe the setting, your roles, client confidentiality, etc." className={`${inputClass} resize-none`} value={form.corporateExpDetails} onChange={setF('corporateExpDetails')} required />
                  </div>
                )}

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={() => { if (validateStep(['yearsExp', 'estEvents'])) goNext() }} disabled={!form.yearsExp || !form.estEvents || !form.corporateExp || (form.corporateExp === 'yes' && !form.corporateExpDetails)} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 md:space-y-16 animate-fadeIn">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Camera Bodies in Kit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2"><label className={labelClass}>Camera Body 1 *</label><input type="text" placeholder="e.g. Sony A7 IV" className={inputClass} value={form.cameraBody1} onChange={setF('cameraBody1')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Camera Body 2 *</label><input type="text" placeholder="e.g. Sony A7S III" className={inputClass} value={form.cameraBody2} onChange={setF('cameraBody2')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Camera Body 3 (or 'None') *</label><input type="text" placeholder="e.g. Sony A6600" className={inputClass} value={form.cameraBody3} onChange={setF('cameraBody3')} required /></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2"><label className={labelClass}>Primary lenses carried on a typical job *</label><input type="text" placeholder="e.g. 24-70mm f/2.8, 70-200mm f/2.8" className={inputClass} value={form.primaryLenses} onChange={setF('primaryLenses')} required /></div>
                  <div className="space-y-2">
                    <label className={labelClass}>Lighting carried on a typical job *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[['none', 'None / Natural light only'], ['speedlights', 'Speedlights / On-camera'], ['off_camera', 'Off-camera strobes / Modifiers'], ['full', 'Full lighting kit']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, lightingKit: val }))} className={btnClass(form.lightingKit === val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-zinc-800 pt-10 mt-10">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Stabilization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Gimbal / Stabilizer *</label>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, stabilizerGimbal: val }))} className={btnClass(form.stabilizerGimbal === val)}>{label}</button>
                        ))}
                      </div>
                      {form.stabilizerGimbal === 'yes' && <input type="text" placeholder="Make/Model" className={inputClass} value={form.stabilizerGimbalModel} onChange={setF('stabilizerGimbalModel')} required />}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Tripod *</label>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, stabilizerTripod: val }))} className={btnClass(form.stabilizerTripod === val)}>{label}</button>
                        ))}
                      </div>
                      {form.stabilizerTripod === 'yes' && <input type="text" placeholder="Make/Model" className={inputClass} value={form.stabilizerTripodModel} onChange={setF('stabilizerTripodModel')} required />}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Slider / Dolly *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, stabilizerSlider: val }))} className={btnClass(form.stabilizerSlider === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-zinc-800 pt-10 mt-10">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Drone Specs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2"><label className={labelClass}>Drone Make/Model (or 'None') *</label><input type="text" placeholder="e.g. DJI Mavic 3 Pro" className={inputClass} value={form.droneModel} onChange={setF('droneModel')} required /></div>
                    <div className="space-y-2">
                      <label className={labelClass}>FAA Part 107 *</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[['licensed', 'Licensed'], ['in_process', 'In Process'], ['none', 'None']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, dronePart107: val }))} className={btnClass(form.dronePart107 === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Waiver-capable *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, droneWaiver: val }))} className={btnClass(form.droneWaiver === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-zinc-800 pt-10 mt-10">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Audio (Videographers)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className={labelClass}>Wireless mic system *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, audioMic: val }))} className={btnClass(form.audioMic === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Boom pole *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, audioBoom: val }))} className={btnClass(form.audioBoom === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Audio recorder *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, audioRecorder: val }))} className={btnClass(form.audioRecorder === val)}>{label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-zinc-800 pt-10 mt-10">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Computer & Editing Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2"><label className={labelClass}>Desktop CPU/GPU, RAM, Storage *</label><input type="text" placeholder="e.g. M2 Max, 64GB, 2TB SSD" className={inputClass} value={form.desktopSpecs} onChange={setF('desktopSpecs')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Laptop Make / Model *</label><input type="text" placeholder="e.g. MacBook Pro 16" className={inputClass} value={form.laptopSpecs} onChange={setF('laptopSpecs')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Primary Monitor Size & Color *</label><input type="text" placeholder="e.g. 27-inch, 100% sRGB" className={inputClass} value={form.monitorSpecs} onChange={setF('monitorSpecs')} required /></div>
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={goNext} disabled={!form.cameraBody1 || !form.cameraBody2 || !form.cameraBody3 || !form.primaryLenses || !form.lightingKit || !form.stabilizerGimbal || (form.stabilizerGimbal === 'yes' && !form.stabilizerGimbalModel) || !form.stabilizerTripod || (form.stabilizerTripod === 'yes' && !form.stabilizerTripodModel) || !form.stabilizerSlider || !form.droneModel || !form.dronePart107 || !form.droneWaiver || !form.audioMic || !form.audioBoom || !form.audioRecorder || !form.desktopSpecs || !form.laptopSpecs || !form.monitorSpecs} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-12 md:space-y-16 animate-fadeIn">
                <div className="space-y-3">
                  <label className={labelClass}>Notice window you can consistently accept *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['1week', '1 week +'], ['48_72h', '48–72 hours'], ['24h', '24 hours'], ['sameday', 'Same day']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, noticeWindow: val }))} className={btnClass(form.noticeWindow === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={labelClass}>Shifts you regularly cover (Check all that apply) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[['shiftDaytime', 'Daytime'], ['shiftEvening', 'Evening'], ['shiftLateNight', 'Late night'], ['shiftWeekend', 'Weekend'], ['shiftHoliday', 'Holiday'], ['shiftUrgent', 'Urgent / 24-hour turnaround']].map(([field, label]) => (
                      <label key={field} className="flex items-start gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 cursor-pointer group">
                        <input type="checkbox" checked={form[field]} onChange={(e) => setForm(p => ({ ...p, [field]: e.target.checked }))} className="mt-1 accent-red-600 text-red-600" />
                        <span className="text-[#FFFFF5]/70 group-hover:text-[#FFFFF5] transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>Estimated events per month you can accept *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['1_2', '1–2'], ['3_5', '3–5'], ['6_10', '6–10'], ['10+', '10+']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(p => ({ ...p, estEventsPerMonth: val }))} className={btnClass(form.estEventsPerMonth === val)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={goNext} disabled={!form.noticeWindow || !form.estEventsPerMonth || (!form.shiftDaytime && !form.shiftEvening && !form.shiftLateNight && !form.shiftWeekend && !form.shiftHoliday && !form.shiftUrgent)} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-12 md:space-y-16 animate-fadeIn">
                <p className="text-zinc-500 text-sm mb-4">Rate your agreement with each statement (1 = Strongly Disagree, 5 = Strongly Agree):</p>

                <div className="space-y-6 bg-zinc-950 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  {[
                    ['conductStanding', 'I can work 6–10 hours on my feet without quality dropping'],
                    ['conductCalm', 'I stay solution-oriented when gear or logistics fail on-site'],
                    ['conductDirection', 'I take creative direction quickly and execute cleanly'],
                    ['conductDress', 'I can adapt wardrobe/appearance to the client setting'],
                    ['conductNoPost', 'I do not post client images personally without written approval']
                  ].map(([field, label]) => (
                    <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pb-6 border-b border-zinc-900 last:border-0 last:pb-0">
                      <span className="text-base text-zinc-300 font-medium leading-relaxed">{label}</span>
                      <div className="flex justify-end gap-2.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button key={val} type="button" onClick={() => setForm(p => ({ ...p, [field]: val }))} className={`w-11 h-11 rounded-full border text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${form[field] === val ? 'bg-red-600 border-red-600 text-[#FFFFF5] scale-110 shadow-lg' : 'bg-zinc-900 border-zinc-850 text-[#FFFFF5]/50 hover:border-zinc-600 hover:text-[#FFFFF5]/80'}`}>
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={goNext} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg cursor-pointer">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-12 md:space-y-16 animate-fadeIn">
                <div className="space-y-3">
                  <label className={labelClass}>A client asks, "Can I get the RAW files?" How do you respond? *</label>
                  <textarea rows={6} placeholder="How do you handle this client conversation under our agency standards?" className={`${inputClass} resize-none`} value={form.scenarioRawFiles} onChange={setF('scenarioRawFiles')} required />
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="button" onClick={goNext} disabled={!form.scenarioRawFiles} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-12 md:space-y-16 animate-fadeIn">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">Minimum Requirements Confirmation</h3>
                  <div className="space-y-5">
                    {[
                      ['reqWiredInternet', 'I have a wired internet connection sufficient for uploading large galleries'],
                      ['reqSla48h', 'I can deliver final files within 48 hours for a standard single-day event'],
                      ['reqFollowUpInterview', 'I am available for a brief follow-up interview if selected']
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-start gap-3.5 cursor-pointer group pb-1">
                        <input type="checkbox" checked={form[field]} onChange={(e) => setForm(p => ({ ...p, [field]: e.target.checked }))} className="mt-1 accent-red-600 text-red-600 h-5 w-5 shrink-0" />
                        <span className="text-[#FFFFF5]/70 group-hover:text-[#FFFFF5] transition-colors text-base md:text-lg">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Preferred Window for Interview *</label>
                  <input type="text" placeholder="e.g. Wednesday afternoons, Thursday 10am-2pm" className={inputClass} value={form.reqPreferredWindow} onChange={setF('reqPreferredWindow')} required />
                </div>

                <div className="space-y-8 bg-zinc-950 p-6 md:p-10 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-4">Screening Questionnaire Sign-Off</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className={labelClass}>Full Legal Name (Printed) *</label><input type="text" placeholder="Jane Doe" className={inputClass} value={form.signCandidateName} onChange={setF('signCandidateName')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Digital Signature (Type Full Legal Name) *</label><input type="text" placeholder="Jane Doe" className={inputClass} style={{ fontFamily: 'Dancing Script, cursive, sans-serif' }} value={form.signCandidateSignature} onChange={setF('signCandidateSignature')} required /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className={labelClass}>Date *</label><input type="date" className={inputClass} value={form.signCandidateDate} onChange={setF('signCandidateDate')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Selected Interview Time Slot *</label><input type="text" placeholder="e.g. July 12, 2pm EST" className={inputClass} value={form.signCandidateTimeSlot} onChange={setF('signCandidateTimeSlot')} required /></div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  <button type="submit" disabled={submitting || !form.reqWiredInternet || !form.reqSla48h || !form.reqFollowUpInterview || !form.reqPreferredWindow || !form.signCandidateName || !form.signCandidateSignature || !form.signCandidateDate || !form.signCandidateTimeSlot} className="group inline-flex items-center gap-3 px-12 py-4 bg-red-600 text-[#FFFFF5] font-bold rounded-full hover:bg-red-700 transition-all text-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? <><Loader2 size={20} className="animate-spin" /> SUBMITTING...</> : <><Upload size={20} /> SUBMIT SCREENING APPLICATION</>}
                  </button>
                  {submitError && <p className="text-zinc-400 text-base mt-4">{submitError}</p>}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Apply
