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
 * Google Sheet should have one tab named exactly: "Form Submissions"
 * Run setupSheet() to create and format it automatically.
 */

const SHEET_ID = '1SJgsEjSIq-kWKIjkxCq5Ag5CfzDTXu0a74QL2vYXZHA'

const HEADERS = [
  'Timestamp',

  // Step 1: Contact & Identity
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

  // Step 2: Primary Specialty & Portfolio
  'Role',
  'Specialty Genre',
  'Specialty Genre Other',
  'Portfolio Primary URL',
  'Portfolio Secondary URL',

  // Step 3: Years & Volume
  'Years Experience',
  'Estimated Events',
  'Corporate Experience',
  'Corporate Experience Details',

  // Step 4: Core Gear Overview
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

  // Step 5: Basic Availability
  'Notice Window',
  'Shift Daytime',
  'Shift Evening',
  'Shift Late Night',
  'Shift Weekend',
  'Shift Holiday',
  'Shift Urgent',
  'Est Events Per Month',

  // Step 6: Professional Conduct Self-Assessment
  'Conduct Standing',
  'Conduct Calm',
  'Conduct Direction',
  'Conduct Dress',
  'Conduct No Post',

  // Step 7: Scenario Check
  'Scenario Raw Files',

  // Step 8: Minimum Requirements Confirmation & Sign-Off
  'Req Wired Internet',
  'Req SLA 48h',
  'Req Follow Up Interview',
  'Req Preferred Window',
  'Sign Candidate Name',
  'Sign Candidate Signature',
  'Sign Candidate Date',
  'Sign Candidate Time Slot'
]

const SHEET_NAMES = ['Form Submissions']

function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID)

  SHEET_NAMES.forEach((name) => {
    let sheet = ss.getSheetByName(name)

    if (!sheet) {
      sheet = ss.insertSheet(name)
    }

    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.getRange(1, 1, 1, HEADERS.length).setBackground('#1a1a1a')
    sheet.getRange(1, 1, 1, HEADERS.length).setFontColor('#ffffff')
    sheet.setFrozenRows(1)
    sheet.setColumnWidths(1, HEADERS.length, 180)
  })
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheetName = 'Form Submissions'
    const ss = SpreadsheetApp.openById(SHEET_ID)
    const sheet = ss.getSheetByName(sheetName)

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found. Run setupSheet() to create it.`)
    }

    const timestamp = new Date().toISOString()
    const row = [
      timestamp,

      // Step 1: Contact & Identity
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.website || '',
      data.socials || '',
      data.homeCityState || '',
      data.airportCode || '',
      data.passportStatus || '',
      data.passportExpiry || '',
      data.willingTravel || '',

      // Step 2: Primary Specialty & Portfolio
      data.role || '',
      data.specialtyGenre || '',
      data.specialtyGenreOther || '',
      data.portfolioPrimary || '',
      data.portfolioSecondary || '',

      // Step 3: Years & Volume
      data.yearsExp || '',
      data.estEvents || '',
      data.corporateExp || '',
      data.corporateExpDetails || '',

      // Step 4: Core Gear Overview
      data.cameraBody1 || '',
      data.cameraBody2 || '',
      data.cameraBody3 || '',
      data.primaryLenses || '',
      data.lightingKit || '',
      data.stabilizerGimbal || '',
      data.stabilizerGimbalModel || '',
      data.stabilizerTripod || '',
      data.stabilizerTripodModel || '',
      data.stabilizerSlider || '',
      data.droneModel || '',
      data.dronePart107 || '',
      data.droneWaiver || '',
      data.audioMic || '',
      data.audioBoom || '',
      data.audioRecorder || '',
      data.desktopSpecs || '',
      data.laptopSpecs || '',
      data.monitorSpecs || '',

      // Step 5: Basic Availability
      data.noticeWindow || '',
      data.shiftDaytime ? 'Yes' : 'No',
      data.shiftEvening ? 'Yes' : 'No',
      data.shiftLateNight ? 'Yes' : 'No',
      data.shiftWeekend ? 'Yes' : 'No',
      data.shiftHoliday ? 'Yes' : 'No',
      data.shiftUrgent ? 'Yes' : 'No',
      data.estEventsPerMonth || '',

      // Step 6: Professional Conduct Self-Assessment
      data.conductStanding || '',
      data.conductCalm || '',
      data.conductDirection || '',
      data.conductDress || '',
      data.conductNoPost || '',

      // Step 7: Scenario Check
      data.scenarioRawFiles || '',

      // Step 8: Minimum Requirements Confirmation & Sign-Off
      data.reqWiredInternet ? 'Yes' : 'No',
      data.reqSla48h ? 'Yes' : 'No',
      data.reqFollowUpInterview ? 'Yes' : 'No',
      data.reqPreferredWindow || '',
      data.signCandidateName || '',
      data.signCandidateSignature || '',
      data.signCandidateDate || '',
      data.signCandidateTimeSlot || ''
    ]

    sheet.appendRow(row)

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Row added to ' + sheetName }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'alive', message: 'POST your form data here.' }))
    .setMimeType(ContentService.MimeType.JSON)
}
