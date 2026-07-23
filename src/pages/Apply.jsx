import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Globe, CheckCircle2, Mail, Loader2, ArrowRight, ChevronLeft, FileText
} from 'lucide-react'
import VideoBackground from '../components/VideoBackground'
import Part2Steps from '../components/Part2Steps'

const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
const CENTRAL_ENGINE_URL = import.meta.env.VITE_CENTRAL_ENGINE_URL
const SCHEDULING_SHEET_NAME = 'Media'

const TOTAL_STEPS = 3
const PART2_TOTAL_STEPS = 2

const INITIAL_FORM = {
  fullName: '', email: '', phone: '', website: '', socials: '',
  homeCityState: '', airportCode: '', passportStatus: '', passportExpiry: '',
  willingTravel: '', specialtyGenre: '', specialtyGenreOther: '',
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
  reqWiredInternet: false, reqSla48h: false,
  reqFollowUpInterview: false, reqPreferredWindow: '',
  // Part 2 fields
  cleanPortfolio: '', cleanPortfolioUrl: '', whiteLabel: '', provideBio: '',
  camPrimary: '', camSecondary: '', camBackup: '', camAux: '',
  lensFullframe: '', lensApsc: '', lensM43: '', lensCinema: '', hasFastLens: '',
  lightOnCamera: '', lightOffCamera: '', lightMonoblocks: '', lightContinuous: '', lightModifiers: '', lightPowerSource: '',
  p2Tripods: '', p2FluidHead: '', p2Gimbal: '', p2Slider: '', p2Jib: '',
  p2DroneMakeModel: '', p2DronePart107License: '', p2DroneWaiverExp: '', p2DroneNightWaiver: '', p2DroneLaanc: '', p2Support360cam: '',
  p2AudioCameraMic: '', p2AudioLav: '', p2AudioRecorder: '', p2AudioShotgun: '', p2AudioBoomPole: '', p2AudioWindscreen: '',
  p2PowerBattery: '', p2PowerChargerCount: '', p2PowerAcAdapter: '', p2StorageMedia: '', p2StorageBackup: '', p2StorageDit: '',
  p2SpecialtyPrimary: '', p2SpecialtySecondary: '', p2Specialties: '', p2EventScale: '',
  swLightroom: '', swPhotoshop: '', swCaptureOne: '', swPhotoMechanic: '', swAiToolkit: '', swAiToolkitSpecify: '',
  swPremiere: '', swDavinci: '', swFinalCut: '', swAfterEffects: '', swAvid: '', swAvidShared: '',
  workflowColor: '', workflowSound: '', workflowSubtitles: '', workflowMusicLicensing: '',
  deliveryFrameio: '', deliveryDam: '', deliveryCrm: '', deliveryCloud: '',
  slaPreview: '', slaPreviewCustom: '', slaPhotos: '', slaPhotosCustom: '', slaVideo: '', slaVideoCustom: '', slaDailies: '', slaDailiesCustom: '',
  fileNamingConvention: '', fileSharedDrive: '', fileConfidentiality: '',
  p2SettingExperience: '',
  cSuiteNda: '', cSuiteDirecting: '', cSuiteSecurity: '',
  p2ScenarioRaw: '', p2ScenarioMissedMoment: '', p2ScenarioEquipmentFailure: '', p2ScenarioEditRequest: '', p2ScenarioRedEye: '',
  legalForms: '', insuranceLiability: '', insuranceLiabilityAmount: '', insuranceEquipment: '', insuranceDeductibleReserve: '',
  brandingAttire: '', brandingReferral: '', brandingConduct: '',
  p2TravelFreeRadius: '', p2TravelPaidRadius: '', p2TravelAirportCode: '', tsaPre: '', travelKitCompleteness: '', travelKitPartialSpecify: '',
  ref1Name: '', ref1Role: '', ref1Company: '', ref1Relationship: '', ref1Email: '', ref1Phone: '',
  ref2Name: '', ref2Role: '', ref2Company: '', ref2Relationship: '', ref2Email: '', ref2Phone: '',
  contextWorkType: '', contextGearGap: '', contextSecondShooter: '', contextMultiDay: '', contextNotes: '',
  p2FullName: '', p2Signature: '', p2Date: '', p2TimeSlot: '',
  agencyName: '', agencySignature: '', agencyDate: ''
}

const Apply = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [part2Active, setPart2Active] = useState(false)
  const [part2Submitted, setPart2Submitted] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [scheduleError, setScheduleError] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [bookedMeeting, setBookedMeeting] = useState(null)

  const scrollTop = () => window.scrollTo(0, 0)
  const goNext = () => { scrollTop(); setStep((s) => s + 1) }
  const goBack = () => { scrollTop(); setStep((s) => s - 1) }

  const fetchWithTimeout = (url, options, timeout = 15000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id))
  }

  const FIELD_LABELS = {
    fullName: 'Full Name', email: 'Email', phone: 'Phone Number', website: 'Website/Portfolio URL',
    socials: 'Instagram / Vimeo / Behance', homeCityState: 'Home Base City, State',
    airportCode: 'Nearest Major Airport Code', passportStatus: 'Passport Status',
    passportExpiry: 'Passport Expiration Date', willingTravel: 'Willingness to Travel',
    specialtyGenre: 'Main Specialty / Genre', specialtyGenreOther: 'Specialty Specification',
    portfolioPrimary: 'Primary Work Sample URL', portfolioSecondary: 'Secondary Work Sample URL',
    yearsExp: 'Years Actively Shooting', estEvents: 'Approximate Events Completed',
    corporateExp: 'Corporate Experience', corporateExpDetails: 'Corporate Experience Details',
    cameraBody1: 'Camera Body 1', cameraBody2: 'Camera Body 2', cameraBody3: 'Camera Body 3',
    primaryLenses: 'Primary Lenses', lightingKit: 'Lighting Kit',
    stabilizerGimbal: 'Gimbal / Stabilizer', stabilizerGimbalModel: 'Gimbal Model',
    stabilizerTripod: 'Tripod', stabilizerTripodModel: 'Tripod Model',
    stabilizerSlider: 'Slider / Dolly', droneModel: 'Drone Make/Model',
    dronePart107: 'FAA Part 107', droneWaiver: 'Waiver-capable',
    audioMic: 'Wireless Mic System', audioBoom: 'Boom Pole', audioRecorder: 'Audio Recorder',
    desktopSpecs: 'Desktop Specs', laptopSpecs: 'Laptop Specs', monitorSpecs: 'Monitor Specs',
    noticeWindow: 'Notice Window', estEventsPerMonth: 'Estimated Events Per Month'
  }

  const validateStep1 = () => {
    const required = [
      'fullName', 'email', 'phone', 'website', 'socials', 'homeCityState',
      'airportCode', 'passportStatus', 'willingTravel', 'specialtyGenre',
      'portfolioPrimary', 'portfolioSecondary', 'yearsExp', 'estEvents', 'corporateExp',
      'cameraBody1', 'cameraBody2', 'cameraBody3', 'primaryLenses', 'lightingKit',
      'stabilizerGimbal', 'stabilizerTripod', 'stabilizerSlider',
      'droneModel', 'dronePart107', 'droneWaiver',
      'audioMic', 'audioBoom', 'audioRecorder',
      'desktopSpecs', 'laptopSpecs', 'monitorSpecs'
    ]
    const missing = required.filter(f => !form[f])
    if (form.passportStatus === 'valid' && !form.passportExpiry) missing.push('passportExpiry')
    if (form.specialtyGenre === 'other' && !form.specialtyGenreOther) missing.push('specialtyGenreOther')
    if (form.corporateExp === 'yes' && !form.corporateExpDetails) missing.push('corporateExpDetails')
    if (form.stabilizerGimbal === 'yes' && !form.stabilizerGimbalModel) missing.push('stabilizerGimbalModel')
    if (form.stabilizerTripod === 'yes' && !form.stabilizerTripodModel) missing.push('stabilizerTripodModel')
    return missing.map(f => FIELD_LABELS[f] || f)
  }

  const validateStep2 = () => {
    const missing = []
    if (!form.noticeWindow) missing.push('Notice Window')
    if (!form.estEventsPerMonth) missing.push('Estimated Events Per Month')
    const anyShift = ['shiftDaytime', 'shiftEvening', 'shiftLateNight', 'shiftWeekend', 'shiftHoliday', 'shiftUrgent'].some(f => form[f])
    if (!anyShift) missing.push('At least one shift type')
    return missing
  }

  const handleGoNext = () => {
    const missing = step === 1 ? validateStep1() : step === 2 ? validateStep2() : []
    setErrors({})
    if (missing.length > 0) {
      const msg = missing.length === 1
        ? `Please fill in: ${missing[0]}`
        : `Please fill in: ${missing.slice(0, -1).join(', ')} & ${missing[missing.length - 1]}`
      setSubmitError(msg)
      scrollTop()
      return
    }
    setSubmitError('')
    goNext()
  }

  const genBookingId = () => crypto.randomUUID()

  const setF = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setCheck = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.checked }))
  }

  const inputClass = "w-full bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 md:p-5 focus:outline-none focus:border-red-500 transition-colors text-[#FFFFF5] placeholder-zinc-600 text-base md:text-lg"
  const inputErrorClass = "w-full bg-zinc-900/80 border border-red-500 rounded-xl p-4 md:p-5 focus:outline-none focus:border-red-500 transition-colors text-[#FFFFF5] placeholder-zinc-600 text-base md:text-lg"
  const labelClass = "text-xs md:text-sm uppercase tracking-wider text-[#FFFFF5]/60 mb-2 block font-semibold"
  const btnClass = (active) => `py-3 px-4 rounded-xl border transition-all cursor-pointer text-sm md:text-base font-medium flex items-center justify-center text-center min-h-[58px] md:min-h-[64px] ${active ? 'bg-red-600 border-red-600 text-[#FFFFF5]' : 'bg-zinc-900/80 border-zinc-700 text-[#FFFFF5]/50 hover:border-zinc-500'}`

  const sendToSheets = async (payload) => {
    if (!GOOGLE_SCRIPT_URL) return
    await fetchWithTimeout(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ ...payload })
    })
  }

  const sendToCentralEngine = async (payload) => {
    if (!CENTRAL_ENGINE_URL) return
    const body = {
      sheetName: SCHEDULING_SHEET_NAME,
      name: payload.fullName || '',
      email: payload.email || '',
      reason: 'Screening Application',
      note: `Interview requested: ${payload.reqFollowUpInterview ? 'Yes' : 'No'} | Preferred window: ${payload.reqPreferredWindow || 'N/A'} | Wired internet: ${payload.reqWiredInternet ? 'Yes' : 'No'} | 48h delivery: ${payload.reqSla48h ? 'Yes' : 'No'}`
    }
    await fetchWithTimeout(CENTRAL_ENGINE_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body)
    })
  }

  const sendPart2ToCentralEngine = async (payload) => {
    if (!CENTRAL_ENGINE_URL) return
    const body = {
      sheetName: SCHEDULING_SHEET_NAME,
      name: payload.fullName || '',
      email: payload.email || '',
      reason: 'Part 2 Detailed Questionnaire',
      note: `Primary: ${payload.p2SpecialtyPrimary || 'N/A'} | Secondary: ${payload.p2SpecialtySecondary || 'N/A'} | Camera: ${payload.camPrimary || 'N/A'} | Legal: ${payload.legalForms || 'N/A'}`
    }
    await fetchWithTimeout(CENTRAL_ENGINE_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body)
    })
  }

  const fetchAvailableSlots = async (date) => {
    if (!CENTRAL_ENGINE_URL) return { availableSlots: [] }
    const res = await fetchWithTimeout(`${CENTRAL_ENGINE_URL}?getSlots=1&sheetName=${encodeURIComponent(SCHEDULING_SHEET_NAME)}&day=${encodeURIComponent(date)}&duration=${encodeURIComponent('30 min')}`)
    if (!res.ok) throw new Error('Failed to fetch slots')
    return res.json()
  }

  const bookSlot = async (date, time) => {
    if (!CENTRAL_ENGINE_URL) return
    const bookingId = genBookingId()
    const body = {
      sheetName: SCHEDULING_SHEET_NAME,
      bookingId,
      name: form.fullName || '',
      email: form.email || '',
      phone: form.phone || '',
      day: date,
      time: time,
      duration: '30 min',
      reason: 'Screening Interview',
      note: `Preferred window: ${form.reqPreferredWindow || ''}`
    }
    const res = await fetchWithTimeout(CENTRAL_ENGINE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
      redirect: 'follow'
    })
    const data = await res.json()
    if (data.success) {
      setBookedMeeting(data)
      return data
    } else {
      throw new Error(data.error || 'Booking failed')
    }
  }

  const handleDateSelected = async (date) => {
    setScheduleDate(date)
    setScheduleTime('')
    setAvailableSlots([])
    setSlotsLoading(true)
    setScheduleError('')
    try {
      const data = await fetchAvailableSlots(date)
      if (data.availableSlots && data.availableSlots.length > 0) {
        setAvailableSlots(data.availableSlots)
      } else if (data.fullyBooked) {
        setScheduleError('This date is fully booked. Try another day.')
      } else {
        setAvailableSlots(['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'])
        setScheduleError('Could not check availability — showing all standard slots. The engine will confirm on submit.')
      }
    } catch {
      setAvailableSlots(['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'])
      setScheduleError('Could not check availability — showing all standard slots. The engine will confirm on submit.')
    }
    setSlotsLoading(false)
  }

  const handleSlotBooking = async (time) => {
    setScheduleTime(time)
    setSubmitting(true)
    setSubmitError('')
    try {
      const meeting = await bookSlot(scheduleDate, time)
      setBookedMeeting(meeting)
      const meetingInfo = `${scheduleDate} at ${time} (30 min)`
      await Promise.allSettled([
        sendToSheets({ ...form, _meeting: meetingInfo }),
        sendToCentralEngine(form)
      ])
      setSubmitting(false)
      setSubmitted(true)
    } catch (err) {
      setScheduleError(err.message || 'Booking failed. Try another slot.')
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!scheduleDate) {
      setSubmitError('Please select a date first.')
      return
    }
    if (!scheduleTime) {
      setSubmitError('Please select a time slot.')
      return
    }
    await handleSlotBooking(scheduleTime)
  }

  const handlePart2Submit = async (e) => {
    e.preventDefault()
    scrollTop()
    setSubmitting(true)
    setSubmitError('')
    try {
      const payload = { ...INITIAL_FORM, ...form }
      await Promise.allSettled([
        sendToSheets(payload),
        sendPart2ToCentralEngine(payload)
      ])
      setPart2Submitted(true)
    } catch {
      setSubmitError('Part 2 submission failed. Please try again.')
    }
    setSubmitting(false)
  }

  const handleReturnHome = () => { scrollTop(); navigate('/') }
  const handleGoToPart2 = () => { scrollTop(); setPart2Active(true); setStep(1) }
  const handlePart2Back = () => {
    scrollTop()
    if (step > 1) setStep((s) => s - 1)
    else { setPart2Active(false); setStep(1) }
  }

  if (part2Submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-[#FFFFF5] px-6 bg-black">
        <div className="fixed inset-0 pointer-events-none">
          <VideoBackground />
          <div className="absolute inset-0 bg-[#161616]/85" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-8 mx-auto"><CheckCircle2 size={48} className="text-green-500" /></div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase">Full Application Complete</h2>
          <p className="text-[#FFFFF5]/70 text-lg md:text-xl mb-8 leading-relaxed">Thank you for completing both parts. Our team has your full profile and will match you to the best opportunities.</p>
          <button onClick={handleReturnHome} className="px-10 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#FFFFF5]/70 text-base font-medium transition-colors cursor-pointer">Return Home</button>
          <div className="flex justify-center gap-8 mt-8"><InstagramIcon size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /><Globe size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /><Mail size={24} className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] cursor-pointer transition-colors" /></div>
        </div>
      </div>
    )
  }

  if (submitted && !part2Active) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-[#FFFFF5] px-6 bg-black">
        <div className="fixed inset-0 pointer-events-none">
          <VideoBackground />
          <div className="absolute inset-0 bg-[#161616]/85" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-8 mx-auto"><CheckCircle2 size={48} className="text-green-500" /></div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase">Part 1 Submitted</h2>
          <p className="text-[#FFFFF5]/70 text-lg md:text-xl mb-4 leading-relaxed">Thank you for applying. Our team is reviewing your screening answers.</p>
          {bookedMeeting && (
            <p className="text-[#FFFFF5]/50 text-base mb-2 leading-relaxed">Screening interview scheduled for <strong className="text-[#FFFFF5]">{scheduleDate}</strong> at <strong className="text-[#FFFFF5]">{scheduleTime}</strong> (30 min).</p>
          )}
          {bookedMeeting?.meetLink && (
            <a href={bookedMeeting.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-[#FFFFF5] font-bold text-base transition-all cursor-pointer mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Join Google Meet
            </a>
          )}
          <p className="text-[#FFFFF5]/50 text-base mb-8 leading-relaxed">Boost your chances — complete the full contractor questionnaire (Part 2) below.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGoToPart2} className="group inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full text-[#FFFFF5] font-bold text-base transition-colors cursor-pointer">
              <FileText size={20} /> Continue to Onboarding
            </button>
            <button onClick={handleReturnHome} className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#FFFFF5]/70 text-base font-medium transition-colors cursor-pointer">Return Home</button>
          </div>
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
          <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${((step - 1) / (part2Active ? PART2_TOTAL_STEPS : TOTAL_STEPS)) * 100}%` }} />
        </div>

        <h1 className="sr-only">Photographer and Videographer Application — Foreign Affairs Creative Collective</h1>
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-16 pb-32">
          {part2Active ? (
            <button onClick={handlePart2Back} className="flex items-center gap-2 text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors mb-8 text-base cursor-pointer">
              <ChevronLeft size={20} /> Back
            </button>
          ) : step === 1 ? (
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors mb-8 text-base cursor-pointer">
              <ChevronLeft size={20} /> Back
            </button>
          ) : (
            <button onClick={goBack} className="flex items-center gap-2 text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors mb-8 text-base cursor-pointer">
              <ChevronLeft size={20} /> Back
            </button>
          )}

          <h2 className="text-3xl md:text-4xl font-bold italic uppercase tracking-tight mb-2">
            {part2Active ? (
              <>
                {step === 1 && 'Identity, Equipment & Specialties'}
                {step === 2 && 'Software, Experience & Sign-off'}
              </>
            ) : (
              <>
                {step === 1 && 'Profile, Specialty, Gear & Experience'}
                {step === 2 && 'Availability, Conduct & Requirements'}
                {step === 3 && 'Schedule Screening Interview'}
              </>
            )}
          </h2>
          <p className="text-[#FFFFF5]/50 text-base md:text-lg mb-10">Step {step} of {part2Active ? PART2_TOTAL_STEPS : TOTAL_STEPS}</p>

          <form onSubmit={part2Active ? (step === PART2_TOTAL_STEPS ? handlePart2Submit : (e) => e.preventDefault()) : (step === TOTAL_STEPS ? handleSubmit : (e) => e.preventDefault())}>

            {/* ═══ PART 1 — STEP 1: PROFILE, SPECIALTY, GEAR & EXPERIENCE ═══ */}
            {!part2Active && step === 1 && (
              <div className="space-y-10 md:space-y-12">
                {/* Contact & Identity */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Contact & Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2"><label className={labelClass}>Full Name *</label><input type="text" placeholder="Jane Doe" className={inputClass} value={form.fullName} onChange={setF('fullName')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Email Address *</label><input type="email" placeholder="jane@example.com" className={`${form.email && errors.email ? inputErrorClass : inputClass}`} value={form.email} onChange={setF('email')} required />{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}</div>
                    <div className="space-y-2"><label className={labelClass}>Phone Number *</label><input type="tel" placeholder="+1 (555) 123-4567" className={`${form.phone && errors.phone ? inputErrorClass : inputClass}`} value={form.phone} onChange={setF('phone')} required />{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}</div>
                    <div className="space-y-2"><label className={labelClass}>Website/Portfolio URL *</label><input type="url" placeholder="https://janedoe.com" className={`${form.website && errors.website ? inputErrorClass : inputClass}`} value={form.website} onChange={setF('website')} required />{errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}</div>
                    <div className="space-y-2"><label className={labelClass}>Instagram / Vimeo / Behance *</label><input type="text" placeholder="@janedoe or link" className={inputClass} value={form.socials} onChange={setF('socials')} required /></div>
                    <div className="space-y-2"><label className={labelClass}>Home Base City, State *</label><input type="text" placeholder="Los Angeles, CA" className={inputClass} value={form.homeCityState} onChange={setF('homeCityState')} required /></div>
                    <div className="space-y-2 md:col-span-2"><label className={labelClass}>Nearest Major Airport Code *</label><input type="text" placeholder="LAX" className={`${form.airportCode && errors.airportCode ? inputErrorClass : inputClass}`} value={form.airportCode} onChange={setF('airportCode')} required />{errors.airportCode && <p className="text-red-500 text-sm mt-1">{errors.airportCode}</p>}</div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-zinc-800">
                    <label className={labelClass}>Passport *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[['valid', 'Valid Passport'], ['realid', 'Real ID / Enhanced ID'], ['none', 'None / Expired']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, passportStatus: val }))} className={btnClass(form.passportStatus === val)}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {form.passportStatus === 'valid' && (
                    <div className="space-y-2 pt-2">
                      <label className={labelClass}>Passport Expiration Date (MM/DD/YYYY) *</label>
                      <input type="text" placeholder="12/31/2030" className={`${form.passportExpiry && errors.passportExpiry ? inputErrorClass : inputClass}`} value={form.passportExpiry} onChange={setF('passportExpiry')} required />
                      {errors.passportExpiry && <p className="text-red-500 text-sm mt-1">{errors.passportExpiry}</p>}
                    </div>
                  )}

                  <div className="space-y-3 pt-6 border-t border-zinc-800">
                    <label className={labelClass}>Willingness to travel *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[['local', 'Local only'], ['regional', 'Regional'], ['domestic', 'Domestic / National'], ['international', 'International']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, willingTravel: val }))} className={btnClass(form.willingTravel === val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Specialty & Portfolio */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Primary Specialty & Portfolio</h3>
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
                    <div className="space-y-2">
                      <label className={labelClass}>Specify Specialty *</label>
                      <input type="text" placeholder="Please specify your specialty" className={inputClass} value={form.specialtyGenreOther} onChange={setF('specialtyGenreOther')} required />
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-800">
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
                </div>

                {/* Work & Volume */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Work & Volume</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2"><label className={labelClass}>Years actively shooting professionally *</label><input type="number" placeholder="5" className={inputClass} value={form.yearsExp} onChange={setF('yearsExp')} required />{errors.yearsExp && <p className="text-red-500 text-sm mt-1">{errors.yearsExp}</p>}</div>
                    <div className="space-y-2"><label className={labelClass}>Approximate events/assignments completed *</label><input type="number" placeholder="100" className={inputClass} value={form.estEvents} onChange={setF('estEvents')} required />{errors.estEvents && <p className="text-red-500 text-sm mt-1">{errors.estEvents}</p>}</div>
                  </div>
                  <div className="pt-6 border-t border-zinc-800">
                    <label className={labelClass}>Worked in healthcare, financial, or corporate environments? *</label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, corporateExp: val }))} className={btnClass(form.corporateExp === val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  {form.corporateExp === 'yes' && (
                    <div className="pt-6 border-t border-zinc-800">
                      <label className={labelClass}>Describe the setting / context *</label>
                      <textarea rows={3} placeholder="Describe the setting, your roles, client confidentiality, etc." className={`${inputClass} resize-none`} value={form.corporateExpDetails} onChange={setF('corporateExpDetails')} required />
                    </div>
                  )}
                </div>

                {/* Gear Information */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Gear Information</h3>

                  <div>
                    <h4 className="text-lg font-semibold text-zinc-400 pb-2 mb-4">Camera Bodies in Kit</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2"><label className={labelClass}>Camera Body 1 *</label><input type="text" placeholder="e.g. Sony A7 IV" className={inputClass} value={form.cameraBody1} onChange={setF('cameraBody1')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Camera Body 2 *</label><input type="text" placeholder="e.g. Sony A7S III" className={inputClass} value={form.cameraBody2} onChange={setF('cameraBody2')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Camera Body 3 (or 'None') *</label><input type="text" placeholder="e.g. Sony A6600" className={inputClass} value={form.cameraBody3} onChange={setF('cameraBody3')} required /></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className={labelClass}>Primary lenses on a typical job *</label><input type="text" placeholder="e.g. 24-70mm f/2.8, 70-200mm f/2.8" className={inputClass} value={form.primaryLenses} onChange={setF('primaryLenses')} required /></div>
                      <div className="space-y-2">
                        <label className={labelClass}>Lighting on a typical job *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[['none', 'None / Natural light only'], ['speedlights', 'Speedlights / On-camera'], ['off_camera', 'Off-camera strobes / Modifiers'], ['full', 'Full lighting kit']].map(([val, label]) => (
                            <button key={val} type="button" onClick={() => setForm(p => ({ ...p, lightingKit: val }))} className={btnClass(form.lightingKit === val)}>{label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <h4 className="text-lg font-semibold text-zinc-400 pb-2 mb-4">Stabilization</h4>
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

                  <div className="pt-6 border-t border-zinc-800">
                    <h4 className="text-lg font-semibold text-zinc-400 pb-2 mb-4">Drone Specs</h4>
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

                  <div className="pt-6 border-t border-zinc-800">
                    <h4 className="text-lg font-semibold text-zinc-400 pb-2 mb-4">Audio (Videographers)</h4>
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

                  <div className="pt-6 border-t border-zinc-800">
                    <h4 className="text-lg font-semibold text-zinc-400 pb-2 mb-4">Computer & Editing Setup</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2"><label className={labelClass}>Desktop CPU/GPU, RAM, Storage *</label><input type="text" placeholder="e.g. M2 Max, 64GB, 2TB SSD" className={inputClass} value={form.desktopSpecs} onChange={setF('desktopSpecs')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Laptop Make / Model *</label><input type="text" placeholder="e.g. MacBook Pro 16" className={inputClass} value={form.laptopSpecs} onChange={setF('laptopSpecs')} required /></div>
                      <div className="space-y-2"><label className={labelClass}>Primary Monitor Size & Color *</label><input type="text" placeholder="e.g. 27-inch, 100% sRGB" className={inputClass} value={form.monitorSpecs} onChange={setF('monitorSpecs')} required /></div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
                  <button type="button" onClick={handleGoNext} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg cursor-pointer">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ PART 1 — STEP 2: AVAILABILITY, CONDUCT & REQUIREMENTS ═══ */}
            {!part2Active && step === 2 && (
              <div className="space-y-10 md:space-y-12">
                {/* Basic Availability */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Basic Availability</h3>
                  <div>
                    <label className={labelClass}>Notice window you can consistently accept *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      {[['1week', '1 week +'], ['48_72h', '48–72 hours'], ['24h', '24 hours'], ['sameday', 'Same day']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, noticeWindow: val }))} className={btnClass(form.noticeWindow === val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-zinc-800">
                    <label className={labelClass}>Shifts you regularly cover (Check all that apply) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      {[['shiftDaytime', 'Daytime'], ['shiftEvening', 'Evening'], ['shiftLateNight', 'Late night'], ['shiftWeekend', 'Weekend'], ['shiftHoliday', 'Holiday'], ['shiftUrgent', 'Urgent / 24-hour turnaround']].map(([field, label]) => (
                        <label key={field} className="flex items-start gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 cursor-pointer group">
                          <input type="checkbox" checked={form[field]} onChange={setCheck(field)} className="mt-1 accent-red-600 text-red-600" />
                          <span className="text-[#FFFFF5]/70 group-hover:text-[#FFFFF5] transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-zinc-800">
                    <label className={labelClass}>Estimated events per month you can accept *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      {[['1_2', '1–2'], ['3_5', '3–5'], ['6_10', '6–10'], ['10+', '10+']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p => ({ ...p, estEventsPerMonth: val }))} className={btnClass(form.estEventsPerMonth === val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Professional Conduct Self-Assessment */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Professional Conduct Self-Assessment</h3>
                  <p className="text-zinc-500 text-sm mb-4">Rate your agreement (1 = Strongly Disagree, 5 = Strongly Agree):</p>
                  <div className="space-y-6">
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
                </div>

                {/* Scenario Check */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Scenario Check</h3>
                  <div>
                    <label className={labelClass}>A client asks, "Can I get the RAW files?" How do you respond?</label>
                    <textarea rows={6} placeholder="How do you handle this client conversation under our agency standards? (Optional)" className={`${inputClass} resize-none mt-3`} value={form.scenarioRawFiles} onChange={setF('scenarioRawFiles')} />
                  </div>
                </div>

                {/* Minimum Requirements Confirmation */}
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Minimum Requirements Confirmation</h3>
                  <div className="space-y-5">
                    {[
                      ['reqWiredInternet', 'I have a wired internet connection sufficient for uploading large galleries'],
                      ['reqSla48h', 'I can deliver final files within 48 hours for a standard single-day event'],
                      ['reqFollowUpInterview', 'I am available for a brief follow-up interview if selected']
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-start gap-3.5 cursor-pointer group pb-3 border-b border-zinc-900 last:border-0">
                        <input type="checkbox" checked={form[field]} onChange={setCheck(field)} className="mt-1 accent-red-600 text-red-600 h-5 w-5 shrink-0" />
                        <span className="text-[#FFFFF5]/70 group-hover:text-[#FFFFF5] transition-colors text-base md:text-lg leading-relaxed">{label}</span>
                      </label>
                    ))}
                  </div>
                  {form.reqFollowUpInterview && (
                    <div className="space-y-2 pt-4 border-t border-zinc-800">
                      <label className={labelClass}>Preferred Window for Interview</label>
                      <input type="text" placeholder="e.g. Wednesday afternoons, Thursday 10am-2pm (Optional)" className={inputClass} value={form.reqPreferredWindow} onChange={setF('reqPreferredWindow')} />
                    </div>
                  )}
                </div>

                <div className="pt-8 text-center">
                  {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
                  <button type="button" onClick={handleGoNext} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg cursor-pointer">
                    Continue to Scheduling <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ PART 1 — STEP 3: SCHEDULE SCREENING INTERVIEW ═══ */}
            {!part2Active && step === 3 && (
              <div className="space-y-10 md:space-y-12">
                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2 mb-6">Schedule Screening Interview</h3>
                  <p className="text-[#FFFFF5]/60 text-sm mb-6">All interviews are 30 minutes. Pick a date and time that works for you.</p>
                  <div className="space-y-2">
                    <label className={labelClass}>Select a Date *</label>
                    <input type="date" className={inputClass} min={new Date().toISOString().split('T')[0]} value={scheduleDate} onChange={e => handleDateSelected(e.target.value)} />
                  </div>
                  {scheduleDate && (
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      <label className={labelClass}>Available Time Slots</label>
                      {slotsLoading ? (
                        <div className="py-8 text-center"><Loader2 size={32} className="animate-spin text-red-500 mx-auto mb-4" /><p className="text-[#FFFFF5]/50 text-sm">Checking availability...</p></div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {availableSlots.map(slot => (
                            <button key={slot} type="button" onClick={() => handleSlotBooking(slot)} className={btnClass(scheduleTime === slot)} disabled={submitting}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-400 text-sm">No slots available this day. Try another date.</p>
                      )}
                    </div>
                  )}
                  {scheduleError && <p className="text-red-500 text-sm mt-4">{scheduleError}</p>}
                  {submitting && (
                    <div className="py-4 text-center"><Loader2 size={24} className="animate-spin text-red-500 mx-auto mb-2" /><p className="text-[#FFFFF5]/50 text-sm">Booking your interview...</p></div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ PART 2 ═══ */}
            {part2Active && (
              <>
                <Part2Steps
                  form={form}
                  setForm={setForm}
                  step={step}
                  setF={setF}
                  labelClass={labelClass}
                  inputClass={inputClass}
                  btnClass={btnClass}
                />
                <div className="pt-8 text-center border-t border-zinc-800/50 mt-8">
                  {step < PART2_TOTAL_STEPS ? (
                    <button type="button" onClick={goNext} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-lg cursor-pointer">
                      Continue <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" disabled={submitting} className="group inline-flex items-center gap-3 px-12 py-4 bg-red-600 text-[#FFFFF5] font-bold rounded-full hover:bg-red-700 transition-all text-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? <><Loader2 size={20} className="animate-spin" /> SUBMITTING...</> : <><Upload size={20} /> SUBMIT PART 2</>}
                    </button>
                  )}
                  {submitError && <p className="text-zinc-400 text-base mt-4">{submitError}</p>}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Apply
