import { useState, useEffect } from 'react'
import { Camera, Video, ArrowRight, MapPin, Clock, DollarSign, Briefcase, CheckCircle2, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import VideoBackground from '../components/VideoBackground'

const Home = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <VideoBackground />
        <div className="absolute inset-0 bg-[#161616]/85" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col text-[#FFFFF5]">
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#FFFFF5]/60 mb-8">Global Creative Collective</p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 italic uppercase leading-none select-none">
            FOREIGN <span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 pr-6 md:pr-10 lg:pr-14">AFFAIRS</span><span className="absolute bottom-1.5 left-0 right-6 md:right-10 lg:right-14 h-[4px] md:h-[8px] bg-red-600" /></span>
          </h1>

          <p className="text-base md:text-xl text-[#FFFFF5]/70 max-w-2xl leading-relaxed mb-12">
            World-class visual storytellers for global brands. Join our elite creative team and start working on high-impact projects.
          </p>

          <div className="flex justify-center gap-8 mb-16 text-[#FFFFF5]/50 uppercase tracking-widest text-xs md:text-sm font-semibold">
            <span className="flex items-center gap-2"><Camera size={18} className="text-[#FFFFF5]/50" /> PHOTOGRAPHY</span>
            <span className="flex items-center gap-2"><Video size={18} className="text-[#FFFFF5]/50" /> VIDEOGRAPHY</span>
          </div>

          <button
            onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#FFFFF5]/50 hover:text-[#FFFFF5] transition-colors cursor-pointer text-xs uppercase tracking-widest font-semibold"
          >
            Scroll
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
    </div>
  )
}

export default Home
