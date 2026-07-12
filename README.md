
# 🌾 KrishiSathi AI - Bharat Insight Studio

> **Empowering Public Data Analysis with AI & Multi-Language Support**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, open-source AI-powered analytics platform designed for exploring public datasets with advanced visualization, multi-language insights, and actionable recommendations. Built on top of Google Gemini AI, it combines powerful analytics with accessibility.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Google Gemini Integration** - Advanced AI models (3.5 Flash & 3.1 Pro)
- **Smart Analysis** - Automatic insights, trends, anomalies, and risk assessment
- **Customizable Prompts** - Pre-built templates or create your own
- **Confidence Scoring** - Track AI confidence on each analysis

### 🌍 Multilingual Capabilities
Insights available in 12+ Indian languages:
- English, Hindi (हिन्दी), Bengali (বাংলা)
- Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ)
- Marathi (मराठी), Gujarati (ગુજરાતી), Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬਿ), Odia (ଓଡ଼ିଆ), Urdu (اردو)

### 📊 Data Management
- **Multi-Format Support** - CSV, JSON, Excel (XLSX)
- **Automatic Parsing** - Smart type detection and data cleaning
- **Statistics Generation** - Headers, duplicates, missing values, distributions
- **Persistent Storage** - Local JSON database

### 📈 Visualization & Reporting
- **Interactive Charts** - Recharts-powered visualizations
- **Report Generation** - Download as Markdown files
- **Data Exploration** - Trends, patterns, comparisons
- **Export Options** - Multiple format support

### 🎨 Modern UI/UX
- **Dark Theme** - Eye-friendly glass-morphism design
- **Responsive Layout** - Optimized for desktop and tablet
- **Intuitive Navigation** - Sidebar-based tab system
- **Real-time Updates** - Hot module reloading

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Link |
|-------------|---------|------|
| **Node.js** | v18+ | [Download](https://nodejs.org/) |
| **npm** | v9+ | Included with Node.js |
| **Gemini API Key** | - | [Get API Key](https://ai.google.dev/) |

### Installation

#### Step 1: Clone & Navigate
```bash
cd KrishiSathi_AI
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure API Key
Create `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Step 4: Start Development Server
```bash
npm run dev
```

#### Step 5: Open in Browser
```
http://localhost:3000
```

> **Note:** If port 3000 is busy, the server automatically uses the next available port (3001, 3002, etc.)

---

## 📦 Available Scripts

| Command | Description | Output |
|---------|-------------|--------|
| `npm run dev` | Development server with hot reload | Localhost dev mode |
| `npm run build` | Production build (Vite + esbuild) | `dist/` folder |
| `npm start` | Run production build | Compiled app |
| `npm run clean` | Remove build artifacts | Clean slate |
| `npm run lint` | TypeScript type checking | Type errors only |

---

## 🏗️ Project Structure

```
KrishiSathi_AI/
│
├── src/
│   ├── components/
│   │   ├── AIStudio.tsx              # 🤖 Main AI analysis interface
│   │   ├── DashboardHome.tsx         # 📊 Home dashboard
│   │   ├── UploadPage.tsx            # 📁 File upload portal
│   │   ├── DatasetLibrary.tsx        # 📚 Dataset browser
│   │   ├── VisualizationStudio.tsx   # 📈 Chart visualization
│   │   ├── ReportGenerator.tsx       # 📄 Report builder
│   │   ├── HistoryTab.tsx            # ⏱️ Analysis history
│   │   ├── SettingsTab.tsx           # ⚙️ User settings
│   │   ├── ProfileTab.tsx            # 👤 User profile
│   │   ├── Navbar.tsx                # 🔝 Top navigation
│   │   ├── Sidebar.tsx               # 📍 Main sidebar
│   │   ├── AILoading.tsx             # ⏳ Loading state
│   │   ├── EmptyState.tsx            # 🚫 Empty placeholders
│   │   └── PromptBuilder.tsx         # 🔨 Custom prompt editor
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Global styles & theme
│   ├── types.ts                      # TypeScript interfaces
│   └── assets/
│       └── images/
│
├── data/
│   ├── db.json                       # 💾 Local data store
│   └── Daily Retail Price of Potato.csv
│
├── server.ts                         # 🖥️ Express backend
├── vite.config.ts                    # ⚡ Vite configuration
├── tsconfig.json                     # 📋 TypeScript config
├── package.json                      # 📦 Dependencies
└── README.md                         # 📖 This file
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### 📊 Datasets

#### Get All Datasets
```http
GET /api/datasets
```
**Response:**
```json
[
  {
    "id": "dataset_123",
    "name": "Potato Prices",
    "rowCount": 1000,
    "headers": ["Date", "Price", "Region"],
    "data": [...]
  }
]
```

#### Upload Dataset
```http
POST /api/datasets
Content-Type: multipart/form-data
```
**Parameters:**
- `file` (required) - CSV, JSON, or XLSX file
- `name` (optional) - Custom dataset name

#### Delete Dataset
```http
DELETE /api/datasets/:id
```

---

### 🤖 AI Analysis

#### Run Analysis
```http
POST /api/ai/analyze
Content-Type: application/json
```
**Request Body:**
```json
{
  "datasetId": "dataset_123",
  "promptText": "Find trends in this data",
  "promptName": "Find Trends",
  "language": "English",
  "temperature": 0.4,
  "model": "gemini-3.5-flash"
}
```

**Response:**
```json
{
  "id": "analysis_456",
  "timestamp": "2024-01-15T10:30:00Z",
  "response": {
    "summary": "Executive summary...",
    "insights": ["Insight 1", "Insight 2"],
    "reasoning": "Analysis reasoning...",
    "evidence": "Supporting data...",
    "confidenceScore": 85,
    "limitations": "Data limitations...",
    "recommendedActions": ["Action 1", "Action 2"],
    "exploreQuestions": ["Question 1"]
  }
}
```

---

### 📚 History

#### Get Analysis History
```http
GET /api/history
```

#### Delete History Entry
```http
DELETE /api/history/:id
```

---

### 📄 Reports

#### Get All Reports
```http
GET /api/reports
```

#### Create Report
```http
POST /api/reports
```

#### Delete Report
```http
DELETE /api/reports/:id
```

---

### ⚙️ Settings & Profile

#### Get Settings
```http
GET /api/settings
```

#### Update Settings
```http
PUT /api/settings
```

#### Get Profile
```http
GET /api/profile
```

#### Update Profile
```http
PUT /api/profile
```

---

## 🎯 How to Use

### 1. Upload a Dataset
1. Click **"Upload"** in the sidebar
2. Select CSV, JSON, or Excel file
3. System auto-parses and validates data
4. Dataset appears in library

### 2. Analyze with AI
1. Go to **"Gemma"** (AI Studio)
2. Select dataset from dropdown
3. Choose prompt template or write custom
4. Adjust temperature (0.1 = factual, 1.0 = creative)
5. Select output language
6. Click **"Initiate Audit Analysis"**

### 3. Review Results
- Executive summary
- Key factual insights
- Analytical reasoning
- Evidence utilization
- Risk warnings & gaps
- Recommended actions

### 4. Export & Share
- **Copy** - Copy full text to clipboard
- **Download** - Get Markdown report

### 5. Track History
- View all past analyses
- Timestamps & models used
- Re-run previous prompts

---

## 📋 Supported File Formats

### CSV
```csv
Date,Price,Region
2024-01-01,150,North
2024-01-02,152,South
```
- ✅ Automatic header detection
- ✅ Quote & escape handling
- ✅ Type inference (numeric, categorical, text)
- ✅ Null value detection

### JSON
```json
[
  {"Date": "2024-01-01", "Price": 150, "Region": "North"},
  {"Date": "2024-01-02", "Price": 152, "Region": "South"}
]
```
- ✅ Array of objects
- ✅ Nested structures
- ✅ Mixed types

### Excel (XLSX)
```
Workbook → Sheet → Table
```
- ✅ Multiple sheets
- ✅ Formula values
- ✅ Cell formatting

---

## 🧠 AI Prompt Templates

### 10 Pre-built Templates

| # | Template | Purpose | Creativity |
|---|----------|---------|-----------|
| 1️⃣ | Generate Summary | Dataset overview | 0.3 |
| 2️⃣ | Find Trends | Correlations & patterns | 0.4 |
| 3️⃣ | Find Anomalies | Outliers & spikes | 0.3 |
| 4️⃣ | Compare Categories | Class distributions | 0.4 |
| 5️⃣ | Risk Analysis | Policy risks & gaps | 0.3 |
| 6️⃣ | Recommendations | Strategic advice | 0.5 |
| 7️⃣ | Question Answering | Specific queries | 0.4 |
| 8️⃣ | Explain Dataset | Layman terms | 0.4 |
| 9️⃣ | Translate Results | Localized insights | 0.2 |
| 🔟 | Executive Report | Comprehensive paper | 0.4 |

### Create Custom Prompts
- Settings → Custom Prompts
- Name your template
- Write system & user prompts
- Set creativity level
- Save for future use

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling

### Backend
- **Express.js** - Server framework
- **Node.js** - Runtime

### AI & Data
- **Google Gemini API** - AI models
- **XLSX** - Excel parsing
- **Recharts** - Data visualization

### UI Components
- **Lucide React** - Icon library
- **Motion** - Animations

### Development
- **tsx** - TypeScript executor
- **esbuild** - Bundler
- **ESLint** - Linting

---

## 📊 Data Storage

### Local Database Structure
```
data/db.json
├── datasets[]         # Uploaded datasets
├── history[]          # Analysis history
├── reports[]          # Generated reports
├── customPrompts[]    # User templates
├── settings{}         # App configuration
└── profile{}          # User profile
```

### Example Database Entry
```json
{
  "datasets": [
    {
      "id": "dataset_abc123",
      "name": "Potato Prices 2024",
      "rowCount": 365,
      "uploadedAt": "2024-01-15T10:30:00Z",
      "headers": ["Date", "Price", "Region"],
      "statistics": {
        "columns": [...],
        "duplicateCount": 0,
        "totalMissing": 5
      },
      "data": [...]
    }
  ]
}
```

---

## 🐛 Troubleshooting

### ❌ Port Already in Use
```
Error: listen EADDRINUSE: address already in use
```
**Solution:** Server auto-selects next port. Check console for actual URL.

### ❌ Gemini API Key Error
```
Error: GEMINI_API_KEY is not defined
```
**Solution:** 
1. Create `.env.local` file
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart server

### ❌ CSS Import Error
```
@import must precede all other statements
```
**Solution:** Ensure `@import` statements are at top of `src/index.css`

### ❌ Build Fails
```bash
# Clear and reinstall
npm run clean
npm install
npm run build
```

### ❌ Hot Reload Issues
```bash
# Disable HMR temporarily
DISABLE_HMR=true npm run dev
```

---

## 🔒 Security & Privacy

- ✅ Local data storage (no cloud sync)
- ✅ No personal data collection
- ✅ API key stored locally only
- ✅ Datasets never shared
- ✅ Privacy mode available in settings

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is open-source and available under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Powering intelligent analysis
- **React & Vite** - Modern frontend development
- **Tailwind CSS** - Beautiful UI styling
- **Open Data Community** - Supporting public data initiatives

---

## 📞 Support & Contact

- 📧 **Email:** support@krishisathi.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/KrishiSathi_AI/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/KrishiSathi_AI/discussions)
- 📖 **Documentation:** Full docs available in `/docs`

---

## 🗺️ Roadmap

- [ ] Multi-user support with authentication
- [ ] Cloud data sync
- [ ] Real-time collaboration
- [ ] Advanced filtering & search
- [ ] Custom visualization builder
- [ ] API rate limiting & quotas
- [ ] Mobile app (React Native)
- [ ] More language support

---

<div align="center">
  <p>
    <strong>Built with ❤️ for public data analysis</strong>
  </p>
  <p>
    <a href="#top">⬆ Back to top</a>
  </p>
</div>
