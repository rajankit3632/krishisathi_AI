<div align="center">
<img width="1200" height="475" alt="KrishiSathi AI Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# KrishiSathi AI - Bharat Insight Studio

A powerful, open-source AI-powered analytics platform for exploring public datasets with multi-language support and actionable insights. Built with **React**, **TypeScript**, **Vite**, and **Google Gemini AI**.

## 🎯 Features

- **🤖 AI-Powered Analysis**: Leverage Google Gemini AI to extract deep insights from your datasets
- **📊 Interactive Data Visualization**: Visualize trends, patterns, and anomalies with recharts
- **🌍 Multi-Language Support**: Get insights in 12+ Indian languages (Hindi, Bengali, Tamil, Telugu, Kannada, Marathi, Gujarati, Malayalam, Punjabi, Odia, Urdu, and English)
- **📁 Multiple File Format Support**: Upload CSV, JSON, and Excel (XLSX) files
- **💾 Persistent Data Storage**: Local JSON database for datasets, history, reports, and user profiles
- **⚙️ Customizable Prompt Templates**: Pre-built templates for summary, trends, anomalies, comparisons, risk analysis, and more
- **📝 Report Generation**: Download analysis reports as Markdown files
- **🎨 Dark-themed UI**: Modern glass-morphism design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd KrishiSathi_AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   The app will be available at `http://localhost:3000` (or the next available port if 3000 is busy)

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the app for production (Vite + esbuild)
- `npm start` - Run the production-built app
- `npm run clean` - Remove the dist folder
- `npm run lint` - Type-check with TypeScript

## 🏗️ Project Structure

```
KrishiSathi_AI/
├── src/
│   ├── components/          # React components
│   │   ├── AIStudio.tsx    # AI analysis interface
│   │   ├── DashboardHome.tsx
│   │   ├── UploadPage.tsx
│   │   ├── DatasetLibrary.tsx
│   │   ├── VisualizationStudio.tsx
│   │   ├── ReportGenerator.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── SettingsTab.tsx
│   │   ├── ProfileTab.tsx
│   │   └── ...
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   ├── types.ts            # TypeScript type definitions
│   └── assets/
├── data/
│   ├── db.json             # Local JSON database
│   └── Daily Retail Price of Potato.csv
├── server.ts               # Express backend server
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

The Express backend provides the following endpoints:

### Datasets
- `GET /api/datasets` - Get all uploaded datasets
- `POST /api/datasets` - Upload a new dataset
- `DELETE /api/datasets/:id` - Delete a dataset

### AI Analysis
- `POST /api/ai/analyze` - Run AI analysis on a dataset with a custom prompt

### History
- `GET /api/history` - Get analysis history
- `DELETE /api/history/:id` - Delete a history entry

### Reports
- `GET /api/reports` - Get generated reports
- `POST /api/reports` - Create a new report
- `DELETE /api/reports/:id` - Delete a report

### Settings & Profile
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 🎨 UI Components

- **AIStudio.tsx** - Main AI analysis interface with parameter panel and results display
- **UploadPage.tsx** - File upload interface supporting CSV, JSON, and Excel
- **DatasetLibrary.tsx** - Browse and manage uploaded datasets
- **VisualizationStudio.tsx** - Interactive data visualization with charts
- **ReportGenerator.tsx** - Generate and download analysis reports
- **Sidebar.tsx** - Navigation sidebar with tab switching
- **Navbar.tsx** - Top navigation bar
- **EmptyState.tsx** - Empty state placeholder for zero data
- **AILoading.tsx** - Loading animation during AI analysis

## 🔐 Data Storage

All data is stored locally in `data/db.json`:
- Uploaded datasets (with headers and parsed data)
- Analysis history (prompts, responses, timestamps)
- Generated reports
- Custom prompt templates
- User settings and profile information

## 🌐 Supported File Formats

- **CSV** - Comma-separated values with automatic type detection
- **JSON** - Array of objects or nested structures
- **XLSX** - Excel spreadsheets with support for multiple sheets

## 🤖 AI Features

### Prompt Templates

Pre-built templates for common analysis tasks:
1. **Generate Summary** - Executive summary of dataset characteristics
2. **Find Trends** - Identify correlations and growth patterns
3. **Find Anomalies** - Detect outliers and unusual values
4. **Compare Categories** - Analyze categorical distributions
5. **Risk Analysis** - Assess public policy risks and data gaps
6. **Recommendations** - Data-driven strategic advice
7. **Question Answering** - Answer specific queries about the data
8. **Explain Dataset** - Layman-friendly explanations
9. **Translate Results** - Localized insights for different audiences
10. **Executive Report** - Comprehensive policy paper

### Customization

- Adjust **temperature/creativity** slider (0.1 - 1.0)
- Select AI model (Gemma 3.5 Flash or Gemma 3.1 Pro)
- Choose output language from 12 Indian languages
- Edit prompts for custom analysis

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + custom glass-morphism utilities
- **Backend**: Express.js
- **AI**: Google Gemini API
- **Database**: Local JSON file storage
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: XLSX (Excel parsing), dotenv

## 📋 Requirements

- Node.js v18+
- Google Gemini API key with appropriate permissions
- ~100MB disk space for dependencies

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy, the server automatically uses the next available port (3001, 3002, etc.)

### API Key Error
Ensure `GEMINI_API_KEY` is set in `.env.local` and valid

### CSS Import Errors
Make sure `@import` statements in `src/index.css` are at the top before other CSS rules

### Build Issues
Run `npm clean` followed by `npm install` and try again

## 📄 License

This project is open-source and available for educational and research purposes.

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- UI design inspired by modern analytics platforms
- Multi-language support for Indian languages via Bhasha initiatives

## 📞 Support

For issues, feature requests, or contributions, please refer to the project documentation or contact the development team.
