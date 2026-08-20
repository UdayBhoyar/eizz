# ⚡ Eizz - Job Experience & Skill Highlighter Browser Extension

**Eizz** is a Manifest V3 browser extension built to enhance job search efficiency. Whenever you click on a job posting on **LinkedIn**, **Indeed**, **Glassdoor**, **Greenhouse**, **Lever**, or any job portal, `Eizz` automatically scans the job description and displays an elegant floating overlay docked at the top-right corner of your screen highlighting **experience criteria** and **key required skills**.

---

## 📦 How to Download & Share with Others

### Option 1: Direct ZIP Download (Easiest for Friends & Users)

1. Download the pre-packaged zip file:
   👉 **[Download eizz-extension-v1.0.0.zip](https://github.com/UdayBhoyar/eizz/archive/refs/tags/v1.0.0.zip)**
2. Unzip `eizz-extension-v1.0.0.zip` on your computer.
3. Open **Chrome** or **Edge** and go to `chrome://extensions` (or `edge://extensions`).
4. Turn **ON** **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped `Eizz` folder.

---

## ✨ Features

- 💼 **Experience Requirement Scanner**: Instantly extracts required years (e.g., `3-5 Years`, `5+ Years`) and labels the experience level (`Senior Level`, `Mid Level`, `Entry / Junior`).
- 🏢 **Company Name Header**: Scans and displays the company name directly in the header (e.g., `🏢 TechCorp Global`).
- 🖐️ **Draggable Anywhere**: Click and drag the overlay window anywhere on your viewport.
- 🛠️ **Categorized Key Skills Taxonomy**: Groups required skills into *Languages*, *Frontend*, *Backend & APIs*, *Cloud & DevOps*, *Databases*, *AI/ML*, *Testing & Tools*, and *Soft Skills*.
- ⭐ **Custom Target Skills**: Highlight your specific target skills in gold (configurable via extension popup).
- 🛡️ **Isolated Shadow DOM Overlay**: Rendered inside a Shadow DOM container, ensuring 100% style isolation without CSS interference from complex job site stylesheets.
- 🔄 **Real-Time SPA Navigation Support**: Uses `MutationObserver` to auto-update when clicking between job listings on dynamic single-page applications like LinkedIn and Indeed.
- 📋 **One-Click Quick Copy**: Copy parsed job summary & key skills directly to clipboard.
- ─ **Collapsible View**: Minimize the overlay into a compact floating badge anytime.

---

## 🌐 Supported Job Platforms

- **LinkedIn** (`linkedin.com/jobs/...`)
- **Indeed** (`indeed.com/...`)
- **Glassdoor** (`glassdoor.com/...`)
- **Greenhouse** (`boards.greenhouse.io/...`)
- **Lever** (`jobs.lever.co/...`)
- **Workday** (`workday.com/...`)
- **Generic Fallback**: Automatic description block detection on any web page.

---

## 📁 Repository Structure

```
Eizz/
├── manifest.json         # Manifest V3 extension configuration
├── icons/                # Extension icons (SVG, 16x16, 48x48, 128x128 PNG)
├── src/
│   ├── parser.js         # Experience & skill NLP regex extraction engine
│   ├── overlay.js        # Shadow DOM overlay renderer & event controller
│   ├── overlay.css       # Dark glassmorphism overlay styles
│   ├── content.js        # Content script & DOM mutation observers
│   └── background.js     # Background service worker & storage init
├── popup/
│   ├── popup.html        # Extension popup control panel
│   ├── popup.js          # Settings & custom target skill manager
│   └── popup.css         # Popup dashboard styling
└── test/
    ├── test-parser.js    # Node.js automated test suite
    └── mock-job.html     # Interactive standalone test job board simulator
```

---

## 🧪 Testing & Local Demo

### Run Automated Parser Tests
```bash
node test/test-parser.js
```

### Try Local Job Simulator Page
Open `test/mock-job.html` in your browser directly, or serve it via a local HTTP server:
```bash
python -m http.server 8080
# Open http://localhost:8080/test/mock-job.html
```

---

## 📜 License

MIT License © 2026 Uday Bhoyar
