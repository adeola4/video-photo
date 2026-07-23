# Google Sheets API Integration Guide

Your Google Apps Script web app handles screening application submissions from the Foreign Affairs creative collective website. When a candidate submits the screening form, it POSTs JSON to the script, which writes a row to a Google Sheet.

---

## Quick Overview

```
Candidate Browser (React App)
        │
        ▼  POST (JSON, no-cors)
┌───────────────────────────────┐
│  Google Apps Script Web App   │
│                               │
│  1. Parses JSON body          │
│  2. Maps fields to columns    │
│  3. Appends row to            │
│     "Form Submissions" sheet  │
│  4. Returns JSON response     │
└───────────────────────────────┘
        │
        ▼
  Row added to Google Sheet
```

---

## 1. Deploy the Script

1. Go to [script.google.com](https://script.google.com) and create a new project
2. Paste the contents of `GoogleAppsScript.gs`
3. Update `SHEET_ID` at the top of the script to your Google Sheet's ID
4. **Deploy → New Deployment → Web App**
5. Set **"Execute as"** → `Me`
6. Set **"Who has access"** → `Anyone`
7. Click **Deploy**
8. Copy the Web App URL

---

## 2. Environment Setup

Add the URL to `.env`:

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

---

## 3. How to Run setupSheet()

After deploying, open the script editor and run the `setupSheet()` function once. This will:

- Create the **"Form Submissions"** sheet if it doesn't exist
- Write all column headers in bold with dark styling
- Freeze the header row
- Set column widths

You can run it from the Apps Script editor by selecting `setupSheet` from the function dropdown and clicking **Run**.

---

## 4. Data Flow

The React app sends a JSON payload via `fetch` with `mode: 'no-cors'`:

```javascript
await fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify(formData)
})
```

The script parses the JSON and maps each field to the corresponding column in the sheet.

---

## 5. Sheet Structure

The **"Form Submissions"** sheet contains these columns:

| # | Column Header | Form Field |
|---|---------------|------------|
| 1 | Timestamp | *(auto-generated)* |
| 2 | Full Name | `fullName` |
| 3 | Email | `email` |
| 4 | Phone | `phone` |
| 5 | Website | `website` |
| 6 | Socials | `socials` |
| 7 | Home Base City, State | `homeCityState` |
| 8 | Airport Code | `airportCode` |
| 9 | Passport Status | `passportStatus` |
| 10 | Passport Expiry | `passportExpiry` |
| 11 | Willingness to Travel | `willingTravel` |
| 12 | Role | `role` |
| 13 | Specialty Genre | `specialtyGenre` |
| 14 | Specialty Genre Other | `specialtyGenreOther` |
| 15 | Portfolio Primary URL | `portfolioPrimary` |
| 16 | Portfolio Secondary URL | `portfolioSecondary` |
| 17 | Years Experience | `yearsExp` |
| 18 | Estimated Events | `estEvents` |
| 19 | Corporate Experience | `corporateExp` |
| 20 | Corporate Experience Details | `corporateExpDetails` |
| 21 | Camera Body 1 | `cameraBody1` |
| 22 | Camera Body 2 | `cameraBody2` |
| 23 | Camera Body 3 | `cameraBody3` |
| 24 | Primary Lenses | `primaryLenses` |
| 25 | Lighting Kit | `lightingKit` |
| 26 | Stabilizer Gimbal | `stabilizerGimbal` |
| 27 | Stabilizer Gimbal Model | `stabilizerGimbalModel` |
| 28 | Stabilizer Tripod | `stabilizerTripod` |
| 29 | Stabilizer Tripod Model | `stabilizerTripodModel` |
| 30 | Stabilizer Slider | `stabilizerSlider` |
| 31 | Drone Model | `droneModel` |
| 32 | Drone Part 107 | `dronePart107` |
| 33 | Drone Waiver | `droneWaiver` |
| 34 | Audio Mic | `audioMic` |
| 35 | Audio Boom | `audioBoom` |
| 36 | Audio Recorder | `audioRecorder` |
| 37 | Desktop Specs | `desktopSpecs` |
| 38 | Laptop Specs | `laptopSpecs` |
| 39 | Monitor Specs | `monitorSpecs` |
| 40 | Notice Window | `noticeWindow` |
| 41 | Shift Daytime | `shiftDaytime` |
| 42 | Shift Evening | `shiftEvening` |
| 43 | Shift Late Night | `shiftLateNight` |
| 44 | Shift Weekend | `shiftWeekend` |
| 45 | Shift Holiday | `shiftHoliday` |
| 46 | Shift Urgent | `shiftUrgent` |
| 47 | Est Events Per Month | `estEventsPerMonth` |
| 48 | Conduct Standing | `conductStanding` |
| 49 | Conduct Calm | `conductCalm` |
| 50 | Conduct Direction | `conductDirection` |
| 51 | Conduct Dress | `conductDress` |
| 52 | Conduct No Post | `conductNoPost` |
| 53 | Scenario Raw Files | `scenarioRawFiles` |
| 54 | Req Wired Internet | `reqWiredInternet` |
| 55 | Req SLA 48h | `reqSla48h` |
| 56 | Req Follow Up Interview | `reqFollowUpInterview` |
| 57 | Req Preferred Window | `reqPreferredWindow` |
| 58 | Sign Candidate Name | `signCandidateName` |
| 59 | Sign Candidate Signature | `signCandidateSignature` |
| 60 | Sign Candidate Date | `signCandidateDate` |
| 61 | Sign Candidate Time Slot | `signCandidateTimeSlot` |

---

## 6. Re-Deploying After Code Changes

After you edit the script in script.google.com:

1. **Deploy → Manage deployments**
2. Click **Edit** (pencil icon) on the current deployment
3. Select **New version**
4. Click **Deploy**
5. The URL **stays the same** — no frontend updates needed

---

## 7. Viewing Logs

In the Apps Script editor:
- **View → Logs** — shows `Logger.log()` output
- **Executions** (sidebar) — shows each run, click to see log details
