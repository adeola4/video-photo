const toggleArrField = (setForm, field, value) => {
  setForm(prev => {
    const arr = prev[field] ? prev[field].split(', ').filter(Boolean) : []
    const idx = arr.indexOf(value)
    if (idx > -1) arr.splice(idx, 1)
    else arr.push(value)
    return { ...prev, [field]: arr.join(', ') }
  })
}

const arrCheck = (form, field, value) => {
  const arr = form[field] ? form[field].split(', ').filter(Boolean) : []
  return arr.includes(value)
}

const Part2Steps = ({ form, setForm, step, setF, labelClass, inputClass, btnClass }) => {
  const T = (field) => (val) => () => setForm(p => ({ ...p, [field]: val }))

  const yesNo = (field) => (
    <div className="flex gap-3">
      {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
        <button key={val} type="button" onClick={T(field)(val)} className={btnClass(form[field] === val)}>{label}</button>
      ))}
    </div>
  )

  const rating = (field) => (
    <div className="flex gap-2 flex-wrap">
      {[['expert', 'Expert'], ['proficient', 'Proficient'], ['basic', 'Basic'], ['none', 'None']].map(([val, label]) => (
        <button key={val} type="button" onClick={T(field)(val)} className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-xs md:text-sm font-medium min-h-[40px] ${form[field] === val ? 'bg-red-600 border-red-600 text-[#FFFFF5]' : 'bg-zinc-900/80 border-zinc-700 text-[#FFFFF5]/50 hover:border-zinc-500'}`}>{label}</button>
      ))}
    </div>
  )

  const chk = (field, val, label) => (
    <label className="flex items-start gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 cursor-pointer group">
      <input type="checkbox" checked={arrCheck(form, field, val)} onChange={() => toggleArrField(setForm, field, val)} className="mt-0.5 accent-red-600 text-red-600 shrink-0" />
      <span className="text-[#FFFFF5]/70 group-hover:text-[#FFFFF5] text-sm leading-relaxed">{label || val}</span>
    </label>
  )

  const Section = ({ title, children }) => (
    <div className="space-y-6 border-t border-zinc-800 pt-10 mt-10 first:border-0 first:pt-0 first:mt-0">
      <h3 className="text-xl font-bold uppercase tracking-tight text-red-500 border-b border-zinc-800 pb-2">{title}</h3>
      {children}
    </div>
  )

  if (step === 1) {
    return (
      <div className="space-y-8">
        <Section title="Identity & Representation">
          <div className="space-y-6">
            <div className="space-y-3"><label className={labelClass}>Do you maintain a client-facing portfolio that removes direct contact info/links?</label>{yesNo('cleanPortfolio')}</div>
            {form.cleanPortfolio === 'yes' && <div className="space-y-2 animate-slideDown"><label className={labelClass}>Portfolio URL</label><input type="url" placeholder="https://..." className={inputClass} value={form.cleanPortfolioUrl} onChange={setF('cleanPortfolioUrl')} /></div>}
            <div className="space-y-3"><label className={labelClass}>Can your images be white-labeled for client decks?</label>{yesNo('whiteLabel')}</div>
            <div className="space-y-3">
              <label className={labelClass}>Can you provide a 150-word bio for agency-branded pages?</label>
              <div className="flex gap-3">{['yes', 'will_provide'].map(v => (<button key={v} type="button" onClick={T('provideBio')(v)} className={btnClass(form.provideBio === v)}>{v === 'yes' ? 'Yes' : 'Will provide upon acceptance'}</button>))}</div>
            </div>
          </div>
        </Section>

        <Section title="Camera Bodies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['camPrimary', 'camSecondary', 'camBackup', 'camAux'].map((f, i) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{['Primary', 'Secondary', 'Backup', 'Auxiliary / Action Cam'][i]}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>

        <Section title="Lens Inventory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['lensFullframe', 'Full Frame'], ['lensApsc', 'APS-C / Super 35'], ['lensM43', 'M4/3'], ['lensCinema', 'Cinema Primes / Zooms']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
          <div className="space-y-3 pt-4"><label className={labelClass}>Do you carry f/1.4 or wider for low-light?</label>{yesNo('hasFastLens')}</div>
        </Section>

        <Section title="Lighting">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['lightOnCamera', 'On-camera flash model/count'], ['lightOffCamera', 'Off-camera speedlights/strobes'], ['lightMonoblocks', 'Monoblocks / studio strobe'], ['lightContinuous', 'Continuous LED (bi-color/RGB)']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
            <div className="space-y-2 md:col-span-2"><label className={labelClass}>Modifiers</label><input type="text" placeholder="Softboxes, octaboxes, beauty dish, grids, reflectors, flags, silks" className={inputClass} value={form.lightModifiers} onChange={setF('lightModifiers')} /></div>
            <div className="space-y-2"><label className={labelClass}>Power source</label><div className="flex gap-3">{[['ac', 'AC'], ['battery', 'Battery'], ['both', 'Both']].map(([v, l]) => (<button key={v} type="button" onClick={T('lightPowerSource')(v)} className={btnClass(form.lightPowerSource === v)}>{l}</button>))}</div></div>
          </div>
        </Section>

        <Section title="Support & Movement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['p2Tripods', 'Tripod(s)'], ['p2FluidHead', 'Fluid head'], ['p2Gimbal', 'Gimbal / gimbal camera'], ['p2Slider', 'Slider / dolly / track'], ['p2Jib', 'Jib / crane'], ['p2Support360cam', '360 / VR camera']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
          <div className="pt-4"><label className={`${labelClass} text-red-400`}>Drone</label></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['p2DroneMakeModel', 'Make / Model'], ['p2DronePart107License', 'FAA Part 107 license # / expiration'], ['p2DroneWaiverExp', 'Waiver experience'], ['p2DroneNightWaiver', 'Night-flight waiver'], ['p2DroneLaanc', 'LAANC access']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>

        <Section title="Audio (Videographers)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['p2AudioCameraMic', 'Camera-mount mic'], ['p2AudioLav', 'Wireless lav / boom system'], ['p2AudioRecorder', 'Dedicated audio recorder'], ['p2AudioShotgun', 'Shotgun mic'], ['p2AudioBoomPole', 'Boom pole / fishpole'], ['p2AudioWindscreen', 'Windscreen / deadcat / blimp']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>

        <Section title="Power & Storage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['p2PowerBattery', 'Battery ecosystem'], ['p2PowerChargerCount', 'On-camera charger count'], ['p2PowerAcAdapter', 'AC adapter availability'], ['p2StorageMedia', 'Memory media / workflow'], ['p2StorageBackup', 'On-set backup method'], ['p2StorageDit', 'DIT / shuttling capability']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type="text" className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>

        <Section title="Specialty Classification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Primary Specialty</label>
              <select className={inputClass} value={form.p2SpecialtyPrimary} onChange={setF('p2SpecialtyPrimary')}>
                <option value="" className="bg-zinc-900 text-[#FFFFF5]/50">-- Select Primary --</option>
                {['Corporate event / conference / convention', 'Social event / wedding / gala', 'Commercial / advertising / campaign', 'Product / e-commerce / catalog', 'Portrait / headshot / executive', 'Editorial / magazine / publication', 'Fashion / lookbook / runway', 'Food / beverage / hospitality', 'Architectural / interior / real estate', 'Automotive / industrial', 'Sports / action / endurance', 'Broadcast / live event / IMAG', 'Documentary / film / narrative', 'Music / live performance / concert', 'Social-first / short-form / Reels', 'Educational / instructional / e-learning', 'Nonprofit / NGO / advocacy', 'Fine art / print / gallery', 'Photojournalism / editorial documentary', 'Aerial / drone imagery', 'Nightlife / after-hours / low light'].map(s => (
                  <option key={s} value={s} className="bg-zinc-900 text-[#FFFFF5]">{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Secondary Specialty</label>
              <select className={inputClass} value={form.p2SpecialtySecondary} onChange={setF('p2SpecialtySecondary')}>
                <option value="" className="bg-zinc-900 text-[#FFFFF5]/50">-- Select Secondary --</option>
                {['Corporate event / conference / convention', 'Social event / wedding / gala', 'Commercial / advertising / campaign', 'Product / e-commerce / catalog', 'Portrait / headshot / executive', 'Editorial / magazine / publication', 'Fashion / lookbook / runway', 'Food / beverage / hospitality', 'Architectural / interior / real estate', 'Automotive / industrial', 'Sports / action / endurance', 'Broadcast / live event / IMAG', 'Documentary / film / narrative', 'Music / live performance / concert', 'Social-first / short-form / Reels', 'Educational / instructional / e-learning', 'Nonprofit / NGO / advocacy', 'Fine art / print / gallery', 'Photojournalism / editorial documentary', 'Aerial / drone imagery', 'Nightlife / after-hours / low light', 'Other'].map(s => (
                  <option key={s} value={s} className="bg-zinc-900 text-[#FFFFF5]">{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4 pt-6">
            <label className={labelClass}>All specialties that apply</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {['Corporate event / conference / convention', 'Social event / wedding / gala / anniversary', 'Commercial / advertising / campaign', 'Product / e-commerce / catalog', 'Portrait / headshot / executive', 'Editorial / magazine / publication', 'Fashion / lookbook / runway', 'Food / beverage / hospitality', 'Architectural / interior / real estate', 'Automotive / industrial', 'Sports / action / endurance', 'Broadcast / live event / IMAG / screen content', 'Documentary / film / narrative', 'Music / live performance / concert', 'Social-first / short-form / Reels / TikTok / Shorts', 'Educational / instructional / e-learning', 'Nonprofit / NGO / advocacy', 'Fine art / print / gallery', 'Photojournalism / editorial documentary', 'Aerial / drone imagery', 'Nightlife / after-hours / low light', 'Other'].map(s => chk('p2Specialties', s, s))}
            </div>
          </div>
          <div className="space-y-4 pt-6">
            <label className={labelClass}>Event scale experience</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {['Intimate: under 100 guests', 'Mid-scale: 100–500 guests', 'Large-scale: 500–1,500 guests', 'Flagship / major: 1,500–5,000 guests', 'Stadium / national: 5,000+ guests'].map(s => chk('p2EventScale', s, s))}
            </div>
          </div>
        </Section>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <Section title="Photo Editing & Culling">
          <div className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
            {[['swLightroom', 'Adobe Lightroom'], ['swPhotoshop', 'Adobe Photoshop'], ['swCaptureOne', 'Capture One']].map(([f, l]) => (
              <div key={f} className="flex flex-col md:flex-row md:items-center gap-3 pb-4 border-b border-zinc-900">
                <span className="text-base text-zinc-300 font-medium min-w-[180px]">{l}</span>
                {rating(f)}
              </div>
            ))}
            <div className="flex flex-col md:flex-row md:items-center gap-3 pb-4 border-b border-zinc-900">
              <span className="text-base text-zinc-300 font-medium min-w-[180px]">Photo Mechanic / culling tool</span>
              {yesNo('swPhotoMechanic')}
            </div>
            <div className="flex flex-col md:flex-row md:items-start gap-3">
              <span className="text-base text-zinc-300 font-medium min-w-[180px] pt-2">AI toolkit</span>
              <div className="flex flex-col gap-2 flex-1">
                {yesNo('swAiToolkit')}
                {form.swAiToolkit === 'yes' && <input type="text" placeholder="Specify which tools" className={inputClass} value={form.swAiToolkitSpecify} onChange={setF('swAiToolkitSpecify')} />}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Video Editing & Finishing">
          <div className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
            {[['swPremiere', 'Adobe Premiere Pro'], ['swDavinci', 'DaVinci Resolve'], ['swFinalCut', 'Final Cut Pro'], ['swAfterEffects', 'After Effects / Motion']].map(([f, l]) => (
              <div key={f} className="flex flex-col md:flex-row md:items-center gap-3 pb-4 border-b border-zinc-900">
                <span className="text-base text-zinc-300 font-medium min-w-[180px]">{l}</span>
                {rating(f)}
              </div>
            ))}
            <div className="flex flex-col md:flex-row md:items-center gap-3 pb-4 border-b border-zinc-900">
              <span className="text-base text-zinc-300 font-medium min-w-[180px]">Avid Media Composer</span>
              {yesNo('swAvid')}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-base text-zinc-300 font-medium min-w-[180px]">Avid shared-project workflow</span>
              {yesNo('swAvidShared')}
            </div>
          </div>
        </Section>

        <Section title="Color, Sound & Graphics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['workflowColor', 'Color grading workflow'], ['workflowSound', 'Sound design / mixing'], ['workflowSubtitles', 'Subtitles / captions / burn-ins'], ['workflowMusicLicensing', 'Music licensing / royalty-free sourcing']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><textarea rows={3} className={`${inputClass} resize-none`} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>

        <Section title="Delivery & Workflow Tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3"><label className={labelClass}>Frame.io / review platform</label>{yesNo('deliveryFrameio')}</div>
            <div className="space-y-3"><label className={labelClass}>DAM / archive system</label>{yesNo('deliveryDam')}</div>
          </div>
          <div className="space-y-4 pt-4">
            <label className={labelClass}>CRM / project management</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {['Asana', 'Trello', 'Monday', 'Airtable', 'Notion', 'Other'].map(s => chk('deliveryCrm', s, s))}
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <label className={labelClass}>Cloud storage</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {['Dropbox', 'Google Drive', 'OneDrive / SharePoint', 'S3 / Backblaze', 'Other'].map(s => chk('deliveryCloud', s, s))}
            </div>
          </div>
        </Section>

        <Section title="Turnaround SLA">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['slaPreview', 'Preview selects / first look'], ['slaPhotos', 'Fully edited photo gallery'], ['slaVideo', 'Highlight reel / edited video'], ['slaDailies', 'Dailies / raw upload']].map(([f, l]) => (
              <div key={f} className="space-y-2">
                <label className={labelClass}>{l}</label>
                <select className={inputClass} value={form[f]} onChange={setF(f)}>
                  <option value="" className="bg-zinc-900 text-[#FFFFF5]/50">-- Select --</option>
                  <option value="same_day" className="bg-zinc-900 text-[#FFFFF5]">Same day</option>
                  <option value="12h" className="bg-zinc-900 text-[#FFFFF5]">Within 12 hours</option>
                  <option value="24h" className="bg-zinc-900 text-[#FFFFF5]">Within 24 hours</option>
                  <option value="48h" className="bg-zinc-900 text-[#FFFFF5]">24–48 hours</option>
                  <option value="72h" className="bg-zinc-900 text-[#FFFFF5]">72 hours</option>
                  <option value="1week" className="bg-zinc-900 text-[#FFFFF5]">1 week</option>
                  <option value="next_business" className="bg-zinc-900 text-[#FFFFF5]">Next business morning</option>
                  <option value="custom" className="bg-zinc-900 text-[#FFFFF5]">Custom</option>
                </select>
                {form[f] === 'custom' && <input type="text" placeholder="Specify" className={`${inputClass} mt-2`} value={form[`${f}Custom`]} onChange={setF(`${f}Custom`)} />}
              </div>
            ))}
          </div>
        </Section>

        <Section title="File Handling Protocol">
          <div className="space-y-5">
            {[['fileNamingConvention', 'Structured file-naming convention'], ['fileSharedDrive', 'Deliver raw assets to shared drive within SLA']].map(([f, l]) => (
              <div key={f} className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">{l}</span>{yesNo(f)}</div>
            ))}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-base text-zinc-300 font-medium">Maintain confidentiality & approved delivery channels</span>
              <div className="flex gap-3">{[['yes', 'Yes'], ['will_confirm', 'Will confirm upon agreement']].map(([v, l]) => (<button key={v} type="button" onClick={T('fileConfidentiality')(v)} className={btnClass(form.fileConfidentiality === v)}>{l}</button>))}</div>
            </div>
          </div>
        </Section>

        <Section title="Setting Experience">
          <p className="text-zinc-500 text-sm">Check all environments covered:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {['Healthcare / hospital / clinical', 'Financial / legal / board-level', 'Corporate headquarters', 'Manufacturing / warehouse / industrial', 'Outdoor / weather-exposed', 'Airport / convention center / large venue', 'Nightclub / concert / festival', 'Place of worship / ceremonial', 'Residential / private home', 'Studio / sound stage', 'Aircraft / yacht / private vessel', 'International / customs-heavy'].map(s => chk('p2SettingExperience', s, s))}
          </div>
        </Section>

        <Section title="C-Suite / VVIP Handling">
          {[['cSuiteNda', 'Photographed under strict confidentiality / NDA'], ['cSuiteDirecting', 'Comfortable directing C-suite subjects'], ['cSuiteSecurity', 'Able to work around security / protocol constraints']].map(([f, l]) => (
            <div key={f} className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-zinc-900 last:border-0">
              <span className="text-base text-zinc-300 font-medium">{l}</span>
              {yesNo(f)}
            </div>
          ))}
        </Section>

        <Section title="Scenario Responses">
          <div className="space-y-6">
            {[['p2ScenarioRaw', 'Client asks, "Can I get the RAW files?" How do you respond?'],
              ['p2ScenarioMissedMoment', 'Must-have moment was not captured and no do-over is possible. What do you do?'],
              ['p2ScenarioEquipmentFailure', 'Primary body fails mid-job with no backup. Walk through recovery.'],
              ['p2ScenarioEditRequest', 'Client demands removal of a visible guest/background element. How do you handle it?'],
              ['p2ScenarioRedEye', 'It\'s 2 a.m., event ran long, 6 a.m. call 90 min away. What do you do?']
            ].map(([f, l]) => (
              <div key={f} className="space-y-2">
                <label className={labelClass}>{l}</label>
                <textarea rows={3} className={`${inputClass} resize-none`} value={form[f]} onChange={setF(f)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Legal, Insurance & Branding">
          <div className="space-y-4">
            <label className={labelClass}>Forms to complete upon offer</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {['W-9 or W-8BEN', 'Independent Contractor Agreement', 'Master Services Agreement', 'Mutual NDA', 'Agency Representation Addendum', 'Equipment Liability & Insurance Waiver'].map(s => chk('legalForms', s, s))}
            </div>
          </div>
          <div className="space-y-5 pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">General liability coverage</span>{yesNo('insuranceLiability')}</div>
            {form.insuranceLiability === 'yes' && <div className="space-y-2 ml-4"><label className={labelClass}>Coverage amount</label><input type="text" placeholder="e.g. $2,000,000" className={inputClass} value={form.insuranceLiabilityAmount} onChange={setF('insuranceLiabilityAmount')} /></div>}
            <div className="space-y-3"><label className={labelClass}>Equipment insurance / floater</label><div className="flex gap-3">{[['personal', 'Personal policy'], ['rider', 'Rider'], ['none', 'None']].map(([v, l]) => (<button key={v} type="button" onClick={T('insuranceEquipment')(v)} className={btnClass(form.insuranceEquipment === v)}>{l}</button>))}</div></div>
            <div className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">Agree to agency deductible reserve</span>{yesNo('insuranceDeductibleReserve')}</div>
            <div className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">Wear agency-approved attire</span>{yesNo('brandingAttire')}</div>
            <div className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">Refer to bookings as agency work</span>{yesNo('brandingReferral')}</div>
            <div className="flex items-center justify-between gap-4 flex-wrap"><span className="text-base text-zinc-300 font-medium">No smoking / phone distraction / unapproved posting</span><div className="flex gap-3">{[['agree', 'Agree'], ['disagree', 'Disagree']].map(([v, l]) => (<button key={v} type="button" onClick={T('brandingConduct')(v)} className={btnClass(form.brandingConduct === v)}>{l}</button>))}</div></div>
          </div>
        </Section>

        <Section title="Travel & Logistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className={labelClass}>Free-drive radius (no travel fee)</label><input type="text" placeholder="e.g. 50 miles" className={inputClass} value={form.p2TravelFreeRadius} onChange={setF('p2TravelFreeRadius')} /></div>
            <div className="space-y-3"><label className={labelClass}>Work outside radius if travel covered?</label>{yesNo('p2TravelPaidRadius')}</div>
            <div className="space-y-2"><label className={labelClass}>Airport code for bookings</label><input type="text" placeholder="e.g. LAX" className={inputClass} value={form.p2TravelAirportCode} onChange={setF('p2TravelAirportCode')} /></div>
            <div className="space-y-3"><label className={labelClass}>TSA Pre / Global Entry</label>{yesNo('tsaPre')}</div>
            <div className="space-y-3">
              <label className={labelClass}>Travel kit completeness</label>
              <div className="flex gap-3">{[['complete', 'Complete'], ['partial', 'Partial']].map(([v, l]) => (<button key={v} type="button" onClick={T('travelKitCompleteness')(v)} className={btnClass(form.travelKitCompleteness === v)}>{l}</button>))}</div>
              {form.travelKitCompleteness === 'partial' && <input type="text" placeholder="Specify what's missing" className={`${inputClass} mt-2`} value={form.travelKitPartialSpecify} onChange={setF('travelKitPartialSpecify')} />}
            </div>
          </div>
        </Section>

        <Section title="References">
          <div className="space-y-8">
            {[['ref1', 'Reference 1'], ['ref2', 'Reference 2']].map(([p, t]) => (
              <div key={p} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                <h4 className="text-lg font-bold text-[#FFFFF5]/80 mb-4 uppercase tracking-tight">{t}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[['Name', 'Name'], ['Role', 'Role / Title'], ['Company', 'Company'], ['Relationship', 'Relationship'], ['Email', 'Email'], ['Phone', 'Phone']].map(([sf, sl]) => (
                    <div key={sf} className="space-y-2"><label className={labelClass}>{sl}</label><input type="text" className={inputClass} value={form[`${p}${sf}`]} onChange={setF(`${p}${sf}`)} /></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Additional Context">
          <div className="space-y-6">
            <div className="space-y-2"><label className={labelClass}>What type of work do you most want us to send you?</label><textarea rows={3} className={`${inputClass} resize-none`} value={form.contextWorkType} onChange={setF('contextWorkType')} /></div>
            <div className="space-y-2"><label className={labelClass}>Equipment gap — what would you rent vs. own?</label><textarea rows={3} className={`${inputClass} resize-none`} value={form.contextGearGap} onChange={setF('contextGearGap')} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3"><label className={labelClass}>Second shooter / assistant?</label>{yesNo('contextSecondShooter')}</div>
              <div className="space-y-3"><label className={labelClass}>Multi-day / travel weekends?</label>{yesNo('contextMultiDay')}</div>
            </div>
            <div className="space-y-2"><label className={labelClass}>Anything else before matching?</label><textarea rows={3} className={`${inputClass} resize-none`} value={form.contextNotes} onChange={setF('contextNotes')} /></div>
          </div>
        </Section>

        <Section title="Sign-off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['p2FullName', 'Full Legal Name'], ['p2Signature', 'Signature'], ['p2Date', 'Date'], ['p2TimeSlot', 'Selected Interview Time Slot']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type={f === 'p2Date' ? 'date' : 'text'} className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {[['agencyName', 'Agency Full Name'], ['agencySignature', 'Agency Signature'], ['agencyDate', 'Date']].map(([f, l]) => (
              <div key={f} className="space-y-2"><label className={labelClass}>{l}</label><input type={f === 'agencyDate' ? 'date' : 'text'} className={inputClass} value={form[f]} onChange={setF(f)} /></div>
            ))}
          </div>
        </Section>
      </div>
    )
  }

  return null
}

export default Part2Steps