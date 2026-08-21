# Part 2: AbleSpace Take Data Workflow & Product Analysis

**Assessment Component**: Full Stack Technical Assessment — Part 2 Product Analysis  
**Target Platform**: AbleSpace Caseload Tab → Take Data Workflow  
**Domain**: Special Education (SPED), Speech-Language Pathology (SLP), Occupational Therapy (OT), IEP Goal Progress Tracking  

---

## 1. Workflow Breakdown

### 1. Starting Point
The user begins on the main AbleSpace Dashboard after logging into their educator/clinician profile.

### 2. Purpose of the Caseload Tab
The **Caseload Tab** serves as the central administrative hub where special education teachers and therapists manage assigned student profiles, view active IEP goals, review service minute targets, and launch goal progress tracking sessions.

### 3. Path to Reach "Take Data"
1. User clicks on the **Caseload Tab** from the primary top/side navigation bar.
2. User searches or filters for a student (e.g., by provider, grade, or service area like Speech/OT).
3. User locates the target student card and clicks the primary **"Take Data"** button.

### 4. Information Displayed on "Take Data" Screen
* **Student Metadata**: Student name, photo/avatar, grade level, and assigned provider.
* **Session Metadata**: Date selector (defaults to current date/time) and session mode (Individual vs. Group).
* **IEP Goals List**: Active goals assigned to the student (e.g., articulation accuracy, behavioral frequency, prompt responsiveness).
* **Goal Input Elements**: Custom data collection cards displaying goal benchmarks, current trial counters (`+`/`-`), percentage inputs, and prompt tier selectors (*Independent*, *Verbal*, *Physical*).
* **Session Notes Field**: Freeform textarea for qualitative session observations.

### 5. User Actions
* Log trial accuracy using `+` (Correct) and `-` (Incorrect) tap triggers.
* Select prompt hierarchy tiers per trial.
* Adjust session date for retrospective data logging.
* Enter qualitative observational notes.
* Click **"Save Data"** / **"Submit Session"** to commit entries.

### 6. System State Changes
* Tapping `+` or `-` immediately increments trial totals and updates live accuracy percentage on the goal card.
* Selecting prompt tiers highlights the active prompt button and links it to the trial entry.
* Clicking "Save Data" disables inputs, displays a loading spinner, commits the session payload to PostgreSQL, shows a success toast, and updates the student's progress graph.

### 7. Data Entry Method
* Single-tap `+` / `-` buttons designed for rapid data collection during live therapy.
* Numerical input fields for duration/frequency targets.
* Multiline text input for observational notes.

### 8. Data Persistence
* Data is held in frontend component state during the active session.
* Permanently persisted to the backend database when the user clicks **"Save Data"**.

### 9. Validation & Error Handling
* Date inputs prohibit future dates.
* System alerts if saving a session with zero recorded trial data.
* Unsaved changes warning modal prevents accidental navigation loss.

### 10. Navigation Flow
`Dashboard` → `Caseload Tab` → `Student Card` → `Take Data Screen` → `Save Data` → `Progress Reports`

---

## 2. Technical Friction & Vulnerability Audit

* **Usability**: Small `+`/`-` tap targets make one-handed tablet tracking difficult during fast-paced classroom sessions.
* **Accessibility**: Low contrast on pastel prompt badges and lack of `aria-live="polite"` screen reader announcements for live counter updates.
* **Performance**: Re-calculating percentage accuracy and re-rendering complex goal trees on rapid taps can cause frame drops on mobile devices.

---

## 3. Prioritized Product Improvements

### A. UX Improvements

#### UX-01: Auto-Save / Draft Session Recovery
* **Current Behavior**: Data exists only in transient component state until "Save Data" is clicked.
* **Problem**: App crash, reload, or dead tablet battery mid-session results in total data loss.
* **Proposed Improvement**: Save draft entries to `localStorage`/`IndexDB` every 5 seconds. Offer a "Restore Unsaved Session" prompt upon reload.
* **User Benefit**: Eliminates loss of critical IEP progress data during live sessions.
* **Priority**: **HIGH**

#### UX-02: Quick Undo Toast for Accidental Taps
* **Current Behavior**: Tapping `+` or `-` immediately alters trial count with no instant rollback trigger.
* **Problem**: Rapid tapping during fast therapy sessions leads to accidental mis-taps.
* **Proposed Improvement**: Add a floating 3-second `Undo` toast after trial entries.
* **User Benefit**: Ensures high data integrity without interrupting therapy momentum.
* **Priority**: **MEDIUM**

---

### B. UI Improvements

#### UI-01: Touch Target Enlargement (WCAG Compliant)
* **Current Behavior**: Standard button sizing for trial counter triggers.
* **Problem**: Hard to hit accurately when holding a tablet with one hand.
* **Proposed Improvement**: Enlarge `+` and `-` buttons to `48px x 48px` minimum with color-coded feedback rings (Green for success, Red for error).
* **User Benefit**: Reduces mis-taps and speeds up live data collection.
* **Priority**: **HIGH**

#### UI-02: Persistent Sticky Save Footer Bar
* **Current Behavior**: The "Save Data" button sits at the bottom of the scrollable page.
* **Problem**: Educators with 5+ goals per student must scroll through the entire page to save.
* **Proposed Improvement**: Fix the "Save Data" bar to the bottom viewport (`position: sticky; bottom: 0`).
* **User Benefit**: Saves time and keeps the primary submit action visible at all times.
* **Priority**: **HIGH**

---

### C. Functionality Improvements

#### FUNC-01: Voice-to-Text Dictation for Session Notes
* **Current Behavior**: Notes must be manually typed via keyboard.
* **Problem**: Typing long observational notes on a mobile keyboard takes too much time during therapy.
* **Proposed Improvement**: Add a microphone button in the Notes textarea leveraging Web Speech API (`SpeechRecognition`).
* **User Benefit**: Enables rapid, hands-free dictation of qualitative session notes.
* **Priority**: **MEDIUM**

#### FUNC-02: Offline Queue Synchronization (Service Worker)
* **Current Behavior**: Submitting data requires an active Wi-Fi/cellular connection.
* **Problem**: Classrooms or outdoor playgrounds often have Wi-Fi dead zones.
* **Proposed Improvement**: Implement background sync using IndexedDB. Submissions made offline are queued and auto-synced when connection recovers.
* **User Benefit**: Guarantees uninterrupted functionality anywhere in the school building.
* **Priority**: **HIGH**
