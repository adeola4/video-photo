/**
 * Google Apps Script — At Ease Healthcare Application Handler
 *
 * Deploy as a Web App:
 *   1. File > New > Project
 *   2. Paste this code
 *   3. Deploy > New Deployment > Web App
 *   4. Set "Execute as" → "Me"
 *   5. Set "Who has access" → "Anyone"
 *   6. Copy the Web App URL into your .env as VITE_GOOGLE_SCRIPT_URL
 *
 * Discord notifications (optional):
 *   After deploying, go to Project Settings > Script Properties and add:
 *     Key:   DISCORD_WEBHOOK
 *     Value: https://discord.com/api/webhooks/...
 *   The script will send embeds for Phase 1, Part 2, newsletter, and lead captures.
 *   If the property is not set, Discord notifications are skipped silently.
 *
 * This script dynamically handles any fields sent in the POST body.
 * Unknown keys become new columns automatically — no need to pre-register.
 * Run setupSheet() to create the initial formatted sheet.
 */

const SHEET_ID = '1SJgsEjSIq-kWKIjkxCq5Ag5CfzDTXu0a74QL2vYXZHA'

const FIXED_COLUMNS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Phone',
  'Website',
  'Socials',
  'Home Base City, State',
  'Airport Code',
  'Passport Status',
  'Passport Expiry',
  'Willingness to Travel',
  'Role',
  'Specialty Genre',
  'Specialty Genre Other',
  'Portfolio Primary URL',
  'Portfolio Secondary URL',
  'Years Experience',
  'Estimated Events',
  'Corporate Experience',
  'Corporate Experience Details',
  'Camera Body 1',
  'Camera Body 2',
  'Camera Body 3',
  'Primary Lenses',
  'Lighting Kit',
  'Stabilizer Gimbal',
  'Stabilizer Gimbal Model',
  'Stabilizer Tripod',
  'Stabilizer Tripod Model',
  'Stabilizer Slider',
  'Drone Model',
  'Drone Part 107',
  'Drone Waiver',
  'Audio Mic',
  'Audio Boom',
  'Audio Recorder',
  'Desktop Specs',
  'Laptop Specs',
  'Monitor Specs',
  'Notice Window',
  'Shift Daytime',
  'Shift Evening',
  'Shift Late Night',
  'Shift Weekend',
  'Shift Holiday',
  'Shift Urgent',
  'Est Events Per Month',
  'Conduct Standing',
  'Conduct Calm',
  'Conduct Direction',
  'Conduct Dress',
  'Conduct No Post',
  'Scenario Raw Files',
  'Req Wired Internet',
  'Req SLA 48h',
  'Req Follow Up Interview',
  'Req Preferred Window',
  'Sign Candidate Name',
  'Sign Candidate Signature',
  'Sign Candidate Date',
  'Sign Candidate Time Slot',
  // Part 2
  'Clean Portfolio',
  'Clean Portfolio URL',
  'White Label',
  'Provide Bio',
  'Cam Primary',
  'Cam Secondary',
  'Cam Backup',
  'Cam Aux',
  'Lens Full Frame',
  'Lens APS-C',
  'Lens M4/3',
  'Lens Cinema',
  'Has Fast Lens',
  'Light On-Camera',
  'Light Off-Camera',
  'Light Monoblocks',
  'Light Continuous',
  'Light Modifiers',
  'Light Power Source',
  'P2 Tripods',
  'P2 Fluid Head',
  'P2 Gimbal',
  'P2 Slider',
  'P2 Jib',
  'P2 Drone Make/Model',
  'P2 Drone Part 107 License',
  'P2 Drone Waiver Exp',
  'P2 Drone Night Waiver',
  'P2 Drone LAANC',
  'P2 Support 360 Cam',
  'P2 Audio Camera Mic',
  'P2 Audio Lav',
  'P2 Audio Recorder',
  'P2 Audio Shotgun',
  'P2 Audio Boom Pole',
  'P2 Audio Windscreen',
  'P2 Power Battery',
  'P2 Power Charger Count',
  'P2 Power AC Adapter',
  'P2 Storage Media',
  'P2 Storage Backup',
  'P2 Storage DIT',
  'P2 Specialty Primary',
  'P2 Specialty Secondary',
  'P2 Specialties',
  'P2 Event Scale',
  'SW Lightroom',
  'SW Photoshop',
  'SW Capture One',
  'SW Photo Mechanic',
  'SW AI Toolkit',
  'SW AI Toolkit Specify',
  'SW Premiere',
  'SW DaVinci',
  'SW Final Cut',
  'SW After Effects',
  'SW Avid',
  'SW Avid Shared',
  'Workflow Color',
  'Workflow Sound',
  'Workflow Subtitles',
  'Workflow Music Licensing',
  'Delivery Frame.io',
  'Delivery DAM',
  'Delivery CRM',
  'Delivery Cloud',
  'SLA Preview',
  'SLA Preview Custom',
  'SLA Photos',
  'SLA Photos Custom',
  'SLA Video',
  'SLA Video Custom',
  'SLA Dailies',
  'SLA Dailies Custom',
  'File Naming Convention',
  'File Shared Drive',
  'File Confidentiality',
  'P2 Setting Experience',
  'C-Suite NDA',
  'C-Suite Directing',
  'C-Suite Security',
  'P2 Scenario Raw',
  'P2 Scenario Missed Moment',
  'P2 Scenario Equipment Failure',
  'P2 Scenario Edit Request',
  'P2 Scenario Red Eye',
  'Legal Forms',
  'Insurance Liability',
  'Insurance Liability Amount',
  'Insurance Equipment',
  'Insurance Deductible Reserve',
  'Branding Attire',
  'Branding Referral',
  'Branding Conduct',
  'P2 Travel Free Radius',
  'P2 Travel Paid Radius',
  'P2 Travel Airport Code',
  'TSA Pre',
  'Travel Kit Completeness',
  'Travel Kit Partial Specify',
  'Ref 1 Name',
  'Ref 1 Role',
  'Ref 1 Company',
  'Ref 1 Relationship',
  'Ref 1 Email',
  'Ref 1 Phone',
  'Ref 2 Name',
  'Ref 2 Role',
  'Ref 2 Company',
  'Ref 2 Relationship',
  'Ref 2 Email',
  'Ref 2 Phone',
  'Context Work Type',
  'Context Gear Gap',
  'Context Second Shooter',
  'Context Multi Day',
  'Context Notes',
  'P2 Full Name',
  'P2 Signature',
  'P2 Date',
  'P2 Time Slot',
  'Agency Name',
  'Agency Signature',
  'Agency Date'
]

const FIELD_MAP = {
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  website: 'Website',
  socials: 'Socials',
  homeCityState: 'Home Base City, State',
  airportCode: 'Airport Code',
  passportStatus: 'Passport Status',
  passportExpiry: 'Passport Expiry',
  willingTravel: 'Willingness to Travel',
  role: 'Role',
  specialtyGenre: 'Specialty Genre',
  specialtyGenreOther: 'Specialty Genre Other',
  portfolioPrimary: 'Portfolio Primary URL',
  portfolioSecondary: 'Portfolio Secondary URL',
  yearsExp: 'Years Experience',
  estEvents: 'Estimated Events',
  corporateExp: 'Corporate Experience',
  corporateExpDetails: 'Corporate Experience Details',
  cameraBody1: 'Camera Body 1',
  cameraBody2: 'Camera Body 2',
  cameraBody3: 'Camera Body 3',
  primaryLenses: 'Primary Lenses',
  lightingKit: 'Lighting Kit',
  stabilizerGimbal: 'Stabilizer Gimbal',
  stabilizerGimbalModel: 'Stabilizer Gimbal Model',
  stabilizerTripod: 'Stabilizer Tripod',
  stabilizerTripodModel: 'Stabilizer Tripod Model',
  stabilizerSlider: 'Stabilizer Slider',
  droneModel: 'Drone Model',
  dronePart107: 'Drone Part 107',
  droneWaiver: 'Drone Waiver',
  audioMic: 'Audio Mic',
  audioBoom: 'Audio Boom',
  audioRecorder: 'Audio Recorder',
  desktopSpecs: 'Desktop Specs',
  laptopSpecs: 'Laptop Specs',
  monitorSpecs: 'Monitor Specs',
  noticeWindow: 'Notice Window',
  shiftDaytime: 'Shift Daytime',
  shiftEvening: 'Shift Evening',
  shiftLateNight: 'Shift Late Night',
  shiftWeekend: 'Shift Weekend',
  shiftHoliday: 'Shift Holiday',
  shiftUrgent: 'Shift Urgent',
  estEventsPerMonth: 'Est Events Per Month',
  conductStanding: 'Conduct Standing',
  conductCalm: 'Conduct Calm',
  conductDirection: 'Conduct Direction',
  conductDress: 'Conduct Dress',
  conductNoPost: 'Conduct No Post',
  scenarioRawFiles: 'Scenario Raw Files',
  reqWiredInternet: 'Req Wired Internet',
  reqSla48h: 'Req SLA 48h',
  reqFollowUpInterview: 'Req Follow Up Interview',
  reqPreferredWindow: 'Req Preferred Window',
  signCandidateName: 'Sign Candidate Name',
  signCandidateSignature: 'Sign Candidate Signature',
  signCandidateDate: 'Sign Candidate Date',
  signCandidateTimeSlot: 'Sign Candidate Time Slot',
  // Part 2
  cleanPortfolio: 'Clean Portfolio',
  cleanPortfolioUrl: 'Clean Portfolio URL',
  whiteLabel: 'White Label',
  provideBio: 'Provide Bio',
  camPrimary: 'Cam Primary',
  camSecondary: 'Cam Secondary',
  camBackup: 'Cam Backup',
  camAux: 'Cam Aux',
  lensFullframe: 'Lens Full Frame',
  lensApsc: 'Lens APS-C',
  lensM43: 'Lens M4/3',
  lensCinema: 'Lens Cinema',
  hasFastLens: 'Has Fast Lens',
  lightOnCamera: 'Light On-Camera',
  lightOffCamera: 'Light Off-Camera',
  lightMonoblocks: 'Light Monoblocks',
  lightContinuous: 'Light Continuous',
  lightModifiers: 'Light Modifiers',
  lightPowerSource: 'Light Power Source',
  p2Tripods: 'P2 Tripods',
  p2FluidHead: 'P2 Fluid Head',
  p2Gimbal: 'P2 Gimbal',
  p2Slider: 'P2 Slider',
  p2Jib: 'P2 Jib',
  p2DroneMakeModel: 'P2 Drone Make/Model',
  p2DronePart107License: 'P2 Drone Part 107 License',
  p2DroneWaiverExp: 'P2 Drone Waiver Exp',
  p2DroneNightWaiver: 'P2 Drone Night Waiver',
  p2DroneLaanc: 'P2 Drone LAANC',
  p2Support360cam: 'P2 Support 360 Cam',
  p2AudioCameraMic: 'P2 Audio Camera Mic',
  p2AudioLav: 'P2 Audio Lav',
  p2AudioRecorder: 'P2 Audio Recorder',
  p2AudioShotgun: 'P2 Audio Shotgun',
  p2AudioBoomPole: 'P2 Audio Boom Pole',
  p2AudioWindscreen: 'P2 Audio Windscreen',
  p2PowerBattery: 'P2 Power Battery',
  p2PowerChargerCount: 'P2 Power Charger Count',
  p2PowerAcAdapter: 'P2 Power AC Adapter',
  p2StorageMedia: 'P2 Storage Media',
  p2StorageBackup: 'P2 Storage Backup',
  p2StorageDit: 'P2 Storage DIT',
  p2SpecialtyPrimary: 'P2 Specialty Primary',
  p2SpecialtySecondary: 'P2 Specialty Secondary',
  p2Specialties: 'P2 Specialties',
  p2EventScale: 'P2 Event Scale',
  swLightroom: 'SW Lightroom',
  swPhotoshop: 'SW Photoshop',
  swCaptureOne: 'SW Capture One',
  swPhotoMechanic: 'SW Photo Mechanic',
  swAiToolkit: 'SW AI Toolkit',
  swAiToolkitSpecify: 'SW AI Toolkit Specify',
  swPremiere: 'SW Premiere',
  swDavinci: 'SW DaVinci',
  swFinalCut: 'SW Final Cut',
  swAfterEffects: 'SW After Effects',
  swAvid: 'SW Avid',
  swAvidShared: 'SW Avid Shared',
  workflowColor: 'Workflow Color',
  workflowSound: 'Workflow Sound',
  workflowSubtitles: 'Workflow Subtitles',
  workflowMusicLicensing: 'Workflow Music Licensing',
  deliveryFrameio: 'Delivery Frame.io',
  deliveryDam: 'Delivery DAM',
  deliveryCrm: 'Delivery CRM',
  deliveryCloud: 'Delivery Cloud',
  slaPreview: 'SLA Preview',
  slaPreviewCustom: 'SLA Preview Custom',
  slaPhotos: 'SLA Photos',
  slaPhotosCustom: 'SLA Photos Custom',
  slaVideo: 'SLA Video',
  slaVideoCustom: 'SLA Video Custom',
  slaDailies: 'SLA Dailies',
  slaDailiesCustom: 'SLA Dailies Custom',
  fileNamingConvention: 'File Naming Convention',
  fileSharedDrive: 'File Shared Drive',
  fileConfidentiality: 'File Confidentiality',
  p2SettingExperience: 'P2 Setting Experience',
  cSuiteNda: 'C-Suite NDA',
  cSuiteDirecting: 'C-Suite Directing',
  cSuiteSecurity: 'C-Suite Security',
  p2ScenarioRaw: 'P2 Scenario Raw',
  p2ScenarioMissedMoment: 'P2 Scenario Missed Moment',
  p2ScenarioEquipmentFailure: 'P2 Scenario Equipment Failure',
  p2ScenarioEditRequest: 'P2 Scenario Edit Request',
  p2ScenarioRedEye: 'P2 Scenario Red Eye',
  legalForms: 'Legal Forms',
  insuranceLiability: 'Insurance Liability',
  insuranceLiabilityAmount: 'Insurance Liability Amount',
  insuranceEquipment: 'Insurance Equipment',
  insuranceDeductibleReserve: 'Insurance Deductible Reserve',
  brandingAttire: 'Branding Attire',
  brandingReferral: 'Branding Referral',
  brandingConduct: 'Branding Conduct',
  p2TravelFreeRadius: 'P2 Travel Free Radius',
  p2TravelPaidRadius: 'P2 Travel Paid Radius',
  p2TravelAirportCode: 'P2 Travel Airport Code',
  tsaPre: 'TSA Pre',
  travelKitCompleteness: 'Travel Kit Completeness',
  travelKitPartialSpecify: 'Travel Kit Partial Specify',
  ref1Name: 'Ref 1 Name',
  ref1Role: 'Ref 1 Role',
  ref1Company: 'Ref 1 Company',
  ref1Relationship: 'Ref 1 Relationship',
  ref1Email: 'Ref 1 Email',
  ref1Phone: 'Ref 1 Phone',
  ref2Name: 'Ref 2 Name',
  ref2Role: 'Ref 2 Role',
  ref2Company: 'Ref 2 Company',
  ref2Relationship: 'Ref 2 Relationship',
  ref2Email: 'Ref 2 Email',
  ref2Phone: 'Ref 2 Phone',
  contextWorkType: 'Context Work Type',
  contextGearGap: 'Context Gear Gap',
  contextSecondShooter: 'Context Second Shooter',
  contextMultiDay: 'Context Multi Day',
  contextNotes: 'Context Notes',
  p2FullName: 'P2 Full Name',
  p2Signature: 'P2 Signature',
  p2Date: 'P2 Date',
  p2TimeSlot: 'P2 Time Slot',
  agencyName: 'Agency Name',
  agencySignature: 'Agency Signature',
  agencyDate: 'Agency Date'
}

// ---------------------------------------------------------------------------
// Sheet definitions
// ---------------------------------------------------------------------------

// Columns for each specialised sheet
const NEWSLETTER_COLUMNS = [
  'Timestamp',
  'Email',
  'Source'
]

const VISITORS_COLUMNS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Source'
]

const CONTRACTS_COLUMNS = [
  'Timestamp',
  'Email',
  'Domain',
  'Accepted',
  'Type'
]

// All sheets that should exist in the spreadsheet
const SHEET_NAMES = ['Form Submissions', 'Newsletter', 'Visitors', 'Contracts']

/**
 * Run this ONCE from the Apps Script editor to create / format all sheets.
 * It is safe to run multiple times — it will not overwrite existing data rows.
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  // ── Form Submissions (full applicant fields) ──────────────────────────────
  _ensureSheet(ss, 'Form Submissions', ['Timestamp', ...Object.values(FIELD_MAP)], 180)

  // ── Newsletter signups ────────────────────────────────────────────────────
  _ensureSheet(ss, 'Newsletter', NEWSLETTER_COLUMNS, 240)

  // ── Visitor / lead-capture popup ──────────────────────────────────────────
  _ensureSheet(ss, 'Visitors', VISITORS_COLUMNS, 240)

  // ── Contract acceptances ──────────────────────────────────────────────────
  _ensureSheet(ss, 'Contracts', CONTRACTS_COLUMNS, 240)

  SpreadsheetApp.getUi().alert('✅ All sheets set up successfully!')
}

/** Helper — create or format a single sheet with given headers. */
function _ensureSheet(ss, name, headers, colWidth) {
  let sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = ss.insertSheet(name)
  }
  const range = sheet.getRange(1, 1, 1, headers.length)
  range.setValues([headers])
  range.setFontWeight('bold')
  range.setBackground('#1a1a1a')
  range.setFontColor('#ffffff')
  sheet.setFrozenRows(1)
  sheet.setColumnWidths(1, headers.length, colWidth || 180)
  return sheet
}

// ── Discord notification helpers ──────────────────────────────────────────────

const DEFAULT_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1524133859560652841/gBfjnebAT9rSkCsFKBGVbQfQYqMGf57RqklzgzVelu-Q5ATkjFeUFtrxBqfjLOX8Z8w4'

const _getDiscordWebhook = () => {
  try {
    return PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK') || DEFAULT_DISCORD_WEBHOOK
  } catch (_) {
    return DEFAULT_DISCORD_WEBHOOK
  }
}

const _trySendDiscord = (data) => {
  const webhook = _getDiscordWebhook()
  if (!webhook) return

  let embed = null
  const type = (data.type || '').trim().toLowerCase()

  if (type === 'contract_acceptance' || (data.sheetName && data.sheetName === 'Contracts')) {
    embed = {
      title: 'Provisional Contract Accepted',
      color: 0x10b981,
      fields: [
        { name: 'Email', value: data.email || '', inline: true },
        { name: 'Domain', value: data.domain || '', inline: true },
        { name: 'Accepted', value: String(data.accepted), inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
  } else if (type === 'newsletter_signup') {
    embed = {
      title: 'Newsletter Signup',
      color: 0x22c55e,
      fields: [
        { name: 'Email', value: data.email || '', inline: true },
        { name: 'Source', value: data.source || '', inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
  } else if (type === 'lead_capture' || (data.sheetName && ['Visitors', 'Leads'].includes(data.sheetName))) {
    embed = {
      title: 'New Lead Captured',
      color: 0x3b82f6,
      fields: [
        { name: 'Name', value: data.name || '', inline: true },
        { name: 'Email', value: data.email || '', inline: true },
        { name: 'Phone', value: data.phone || 'N/A', inline: true },
        { name: 'Source', value: data.source || '', inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
  } else if (data.p2SpecialtyPrimary || data.cleanPortfolio || data.camPrimary) {
    embed = {
      title: 'Part 2 Detailed Questionnaire Submitted',
      color: 0x8b5cf6,
      fields: [
        { name: 'Name', value: data.fullName || data.p2FullName || '', inline: true },
        { name: 'Email', value: data.email || '', inline: true },
        { name: 'Primary Specialty', value: data.p2SpecialtyPrimary || 'N/A', inline: true },
        { name: 'Secondary Specialty', value: data.p2SpecialtySecondary || 'N/A', inline: true },
        { name: 'Camera Primary', value: data.camPrimary || 'N/A', inline: true },
        { name: 'Travel Radius', value: data.p2TravelFreeRadius || 'N/A', inline: true },
      ],
      timestamp: new Date().toISOString(),
    }
  } else if (data.fullName) {
    const fields = [
      { name: 'Name', value: data.fullName || '', inline: true },
      { name: 'Email', value: data.email || '', inline: true },
      { name: 'Phone', value: data.phone || 'N/A', inline: true },
      { name: 'Location', value: `${data.homeCityState || ''} (${data.airportCode || ''})`, inline: true },
      { name: 'Portfolio', value: data.website || 'N/A', inline: true },
      { name: 'Specialty', value: data.specialtyGenre || 'N/A', inline: true },
      { name: 'Interview Requested', value: data.reqFollowUpInterview ? 'Yes' : 'No', inline: true },
      { name: 'Preferred Window', value: data.reqPreferredWindow || 'N/A', inline: true },
    ]
    if (data._meeting) {
      fields.push({ name: 'Screening Interview', value: data._meeting, inline: false })
    }
    embed = {
      title: 'New Screening Application',
      color: 0xef4444,
      fields,
      timestamp: new Date().toISOString(),
    }
  }

  if (embed) {
    try {
      UrlFetchApp.fetch(webhook, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ embeds: [embed] }),
        muteHttpExceptions: true,
      })
    } catch (_) {
      /* silent — don't break sheet write if Discord is down */
    }
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.openById(SHEET_ID)
    const timestamp = new Date().toISOString()

    // ── Route by sheetName / type ─────────────────────────────────────────
    const requestedSheet = (data.sheetName || '').trim()

    if (requestedSheet === 'Contracts' || data.type === 'contract_acceptance') {
      const result = _appendSimpleRow(ss, 'Contracts', CONTRACTS_COLUMNS, {
        Timestamp: timestamp,
        Email: data.email || '',
        Domain: data.domain || '',
        Accepted: data.accepted !== undefined ? String(data.accepted) : 'true',
        Type: data.type || 'contract_acceptance'
      })
      _trySendDiscord(data)
      return result
    }

    if (requestedSheet === 'Newsletter' || data.type === 'newsletter_signup') {
      const result = _appendSimpleRow(ss, 'Newsletter', NEWSLETTER_COLUMNS, {
        Timestamp: timestamp,
        Email: data.email || '',
        Source: data.source || 'footer'
      })
      _trySendDiscord(data)
      return result
    }

    if (requestedSheet === 'Visitors' || requestedSheet === 'Leads' || data.type === 'lead_capture') {
      const result = _appendSimpleRow(ss, 'Visitors', VISITORS_COLUMNS, {
        Timestamp: timestamp,
        Name: data.name || '',
        Email: data.email || '',
        Phone: data.phone || '',
        Source: data.source || 'website_popup'
      })
      _trySendDiscord(data)
      return result
    }

    // ── Default: Form Submissions (full applicant form) ───────────────────
    const sheetName = 'Form Submissions'
    const sheet = ss.getSheetByName(sheetName)

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found. Run setupSheet() to create it.`)
    }

    // Get existing headers (normalized for matching)
    const lastCol = sheet.getLastColumn()
    const rawHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : ['Timestamp']
    let headers = rawHeaders
      .map((h) => String(h).trim().replace(/\s+/g, ' '))
      .filter((h) => h.length > 0)
    const headerSet = new Set(headers)

    // Ensure Timestamp column exists
    if (!headerSet.has('Timestamp')) {
      headers.unshift('Timestamp')
      headerSet.add('Timestamp')
    }

    // Find any unmapped keys in data and add them as extra columns
    const extraHeaders = []
    Object.keys(data).forEach((key) => {
      if (key === 'sheetName' || key.startsWith('_')) return
      const mapped = FIELD_MAP[key]
      const colName = (mapped || key).trim().replace(/\s+/g, ' ')
      if (!headerSet.has(colName)) {
        headers.push(colName)
        headerSet.add(colName)
        extraHeaders.push(colName)
      }
    })

    // Write headers if we added new ones
    if (extraHeaders.length > 0) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setValues([headers])
      headerRange.setFontWeight('bold')
      headerRange.setBackground('#1a1a1a')
      headerRange.setFontColor('#ffffff')
      sheet.setFrozenRows(1)
    }

    // Build a reverse map: normalized column name → field key
    // This handles whitespace, case, and spelling variations
    const normFieldMap = {}
    Object.entries(FIELD_MAP).forEach(([key, colName]) => {
      const n = colName.trim().replace(/\s+/g, ' ').toLowerCase()
      normFieldMap[n] = key
      normFieldMap[colName.trim()] = key
    })

    // Also index any previously-added extra columns by their exact key name
    Object.keys(data).forEach((key) => {
      if (key === 'sheetName' || key.startsWith('_')) return
      if (!FIELD_MAP[key]) {
        normFieldMap[key.trim().toLowerCase()] = key
        normFieldMap[key.trim()] = key
      }
    })

    // Build row: Timestamp + each header's value from data
    const row = headers.map((header) => {
      if (String(header).trim() === 'Timestamp') return timestamp

      const norm = String(header).trim().replace(/\s+/g, ' ')
      const fieldKey = normFieldMap[norm] || normFieldMap[norm.toLowerCase()]

      if (fieldKey) {
        const val = data[fieldKey]
        if (typeof val === 'boolean') return val ? 'Yes' : 'No'
        return val !== undefined && val !== null ? String(val) : ''
      }

      // Fallback: direct key match (for truly extra columns)
      const rawMatch = Object.keys(data).find(
        (dk) => dk === norm || dk.toLowerCase() === norm.toLowerCase()
      )
      if (rawMatch) {
        const val = data[rawMatch]
        if (typeof val === 'boolean') return val ? 'Yes' : 'No'
        return val !== undefined && val !== null ? String(val) : ''
      }

      return ''
    })

    sheet.appendRow(row)
    _trySendDiscord(data)

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Row added to ' + sheetName }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Append a row to a simple fixed-column sheet (Newsletter / Visitors).
 * Auto-creates the sheet with headers if it doesn't exist yet.
 */
function _appendSimpleRow(ss, name, columnDefs, valueMap) {
  let sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = _ensureSheet(ss, name, columnDefs, 240)
  }
  const row = columnDefs.map((col) => valueMap[col] !== undefined ? valueMap[col] : '')
  sheet.appendRow(row)
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Row added to ' + name }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'alive', message: 'POST your form data here.' }))
    .setMimeType(ContentService.MimeType.JSON)
}
