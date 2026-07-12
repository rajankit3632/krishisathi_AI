import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import XLSX from "xlsx";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 3000);

function listenWithFallback(port: number, attemptsLeft: number) {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Bharat Insight Studio is running on http://localhost:${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.warn(`Port ${port} is busy, trying ${port + 1}...`);
      server.close(() => listenWithFallback(port + 1, attemptsLeft - 1));
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

// High limits for large uploaded datasets (CSV, Excel, JSON)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to JSON persistence store
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data folder and database exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      datasets: [],
      history: [],
      reports: [],
      customPrompts: [],
      settings: {
        theme: "dark",
        language: "English",
        gemmaEndpoint: "",
        model: "gemini-3.5-flash",
        exportPreference: "pdf",
        notifications: true,
        privacyMode: false
      },
      profile: {
        name: "Monojit Nandy",
        email: "monojitnandy20052023lp@gmail.com",
        organization: "National Data Informatics Cell",
        role: "Lead Public Data Specialist",
        avatarSeed: "india-analyst",
        storageUsed: "0 KB"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf8");
  }
}

initDB();

// DB Access Helpers
function readDB() {
  try {
    initDB();
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return { datasets: [], history: [], reports: [], customPrompts: [], settings: {}, profile: {} };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    // Update profile storage space metadata dynamically
    updateStorageMetadata();
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

function updateStorageMetadata() {
  try {
    const stats = fs.statSync(DB_FILE);
    const sizeInKB = stats.size / 1024;
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    db.profile.storageUsed = `${sizeInKB.toFixed(1)} KB`;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    // Ignore metadata size failure
  }
}

// Lazy load Gemini AI to avoid crash on startup if API key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add your key in Settings > Secrets to enable AI insights.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Parsers
function parseCSV(content: string) {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) {
    throw new Error("Empty CSV file content.");
  }

  // simple CSV parser respecting quotes and escaping
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const firstLine = lines[0].trim();
  if (!firstLine) {
    throw new Error("Invalid CSV format. Missing headers.");
  }

  const headers = parseLine(firstLine).map(h => h.replace(/^"|"$/g, '').trim()).filter(h => h !== "");
  const data: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    const values = parseLine(line);
    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      let val: any = values[index];
      if (val !== undefined) {
        val = val.replace(/^"|"$/g, '').trim();
        if (val === "" || val.toLowerCase() === "null" || val.toLowerCase() === "nan" || val.toLowerCase() === "na" || val === "-") {
          val = null;
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
      } else {
        val = null;
      }
      row[header] = val;
    });
    data.push(row);
  }
  return { headers, data };
}

function parseJSON(content: string) {
  const parsed = JSON.parse(content);
  let data: Record<string, any>[] = [];
  if (Array.isArray(parsed)) {
    data = parsed;
  } else if (parsed && typeof parsed === "object") {
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key])) {
        data = parsed[key];
        break;
      }
    }
  }
  if (data.length === 0) {
    throw new Error("Invalid JSON structure. Expected an array of objects.");
  }
  const headers = Object.keys(data[0] || {});
  return { headers, data };
}

function parseXLSX(base64Content: string) {
  const buffer = Buffer.from(base64Content, 'base64');
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  if (data.length === 0) {
    throw new Error("Excel sheet has no data rows.");
  }
  const headers = Object.keys(data[0] || {});
  // Format numeric and null entries
  const cleanedData = data.map(row => {
    const cleanedRow: Record<string, any> = {};
    headers.forEach(h => {
      let val = row[h];
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed === "" || trimmed.toLowerCase() === 'null') {
          val = null;
        } else if (!isNaN(Number(trimmed))) {
          val = Number(trimmed);
        }
      }
      cleanedRow[h] = val;
    });
    return cleanedRow;
  });
  return { headers, data: cleanedData };
}

// Generate columns, duplicate count, missing metrics, and numeric/categorical aggregates
function generateStatistics(headers: string[], data: Record<string, any>[]) {
  const columns: any[] = [];
  let totalMissing = 0;

  // Duplicate calculation
  const rowStrings = data.map(r => JSON.stringify(r));
  const uniqueRows = new Set(rowStrings);
  const duplicateCount = data.length - uniqueRows.size;

  headers.forEach(col => {
    const vals = data.map(r => r[col]).filter(v => v !== null && v !== undefined && String(v).trim() !== "");
    const colMissingCount = data.length - vals.length;
    totalMissing += colMissingCount;

    // Type detection heuristics
    let colType: 'numeric' | 'categorical' | 'date' | 'text' = 'text';
    const isNumeric = vals.length > 0 && vals.every(v => typeof v === 'number');
    const isDate = vals.length > 0 && vals.every(v => {
      const d = Date.parse(String(v));
      return !isNaN(d) && String(v).length > 6 && isNaN(Number(v));
    });

    const uniqueVals = Array.from(new Set(vals));
    const uniqueCount = uniqueVals.length;

    if (isNumeric) {
      colType = 'numeric';
    } else if (isDate) {
      colType = 'date';
    } else if (uniqueCount <= 15 || (vals.length > 0 && vals.length / uniqueCount >= 2)) {
      colType = 'categorical';
    } else {
      colType = 'text';
    }

    const stats: any = {};
    if (colType === 'numeric') {
      const numVals = vals as number[];
      if (numVals.length > 0) {
        const min = Math.min(...numVals);
        const max = Math.max(...numVals);
        const sum = numVals.reduce((a, b) => a + b, 0);
        const avg = sum / numVals.length;
        stats.min = parseFloat(min.toFixed(2));
        stats.max = parseFloat(max.toFixed(2));
        stats.sum = parseFloat(sum.toFixed(2));
        stats.avg = parseFloat(avg.toFixed(2));
      }
    } else if (colType === 'categorical') {
      const frequencies: Record<string, number> = {};
      vals.forEach(v => {
        const s = String(v);
        frequencies[s] = (frequencies[s] || 0) + 1;
      });
      // Top 8 frequencies for visual charts
      const sortedFreqs = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
      stats.frequencies = Object.fromEntries(sortedFreqs);
    }

    columns.push({
      name: col,
      type: colType,
      missingCount: colMissingCount,
      uniqueCount,
      stats
    });
  });

  return {
    columns,
    duplicateCount,
    missingCount: totalMissing
  };
}

// ==========================================
// API REST ENDPOINTS
// ==========================================

// Global Health Status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Profile Management
app.get("/api/profile", (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

app.post("/api/profile", (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  writeDB(db);
  res.json(db.profile);
});

// Settings Preferences
app.get("/api/settings", (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// Datasets list (metadata list only, excluding heavy raw rows)
app.get("/api/datasets", (req, res) => {
  const db = readDB();
  const summaryList = db.datasets.map((d: any) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    size: d.size,
    uploadDate: d.uploadDate,
    rowCount: d.rowCount,
    colCount: d.colCount,
    duplicateCount: d.duplicateCount,
    missingCount: d.missingCount,
    columns: d.columns
  }));
  res.json(summaryList);
});

// Specific dataset fetch (including raw rows)
app.get("/api/datasets/:id", (req, res) => {
  const db = readDB();
  const dataset = db.datasets.find((d: any) => d.id === req.params.id);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  res.json(dataset);
});

// Dataset Uploader Endpoint
app.post("/api/datasets/upload", (req, res) => {
  try {
    const { name, type, content, size } = req.body;
    if (!name || !type || !content) {
      return res.status(400).json({ error: "Missing name, type, or content fields." });
    }

    let parsed: { headers: string[]; data: any[] };

    if (type === 'csv') {
      parsed = parseCSV(content);
    } else if (type === 'json') {
      parsed = parseJSON(content);
    } else if (type === 'xlsx') {
      parsed = parseXLSX(content);
    } else {
      return res.status(400).json({ error: "Unsupported dataset file type." });
    }

    const stats = generateStatistics(parsed.headers, parsed.data);

    const newDataset = {
      id: "dataset_" + Math.random().toString(36).substr(2, 9),
      name,
      type,
      size: size || `${(content.length / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString(),
      rowCount: parsed.data.length,
      colCount: parsed.headers.length,
      duplicateCount: stats.duplicateCount,
      missingCount: stats.missingCount,
      columns: stats.columns,
      data: parsed.data // Full data rows kept for sorting, rendering, and visualizer
    };

    const db = readDB();
    db.datasets.push(newDataset);
    writeDB(db);

    // Return the response without raw data rows to optimize network traffic
    const { data, ...responseMeta } = newDataset;
    res.status(201).json(responseMeta);
  } catch (error: any) {
    console.error("Upload parsing failure:", error);
    res.status(500).json({ error: error.message || "An error occurred while parsing the dataset." });
  }
});

// Dataset Renamer
app.post("/api/datasets/:id/rename", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing new name." });

  const db = readDB();
  const idx = db.datasets.findIndex((d: any) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Dataset not found." });

  db.datasets[idx].name = name;
  writeDB(db);
  res.json({ success: true, name });
});

// Dataset Deleter
app.delete("/api/datasets/:id", (req, res) => {
  const db = readDB();
  const filtered = db.datasets.filter((d: any) => d.id !== req.params.id);
  if (filtered.length === db.datasets.length) {
    return res.status(404).json({ error: "Dataset not found." });
  }
  db.datasets = filtered;
  writeDB(db);
  res.json({ success: true });
});

// ==========================================
// AI INSIGHT STUDIO ENGINE (Gemma & Gemini)
// ==========================================

// History retrieval
app.get("/api/history", (req, res) => {
  const db = readDB();
  res.json(db.history || []);
});

app.delete("/api/history/:id", (req, res) => {
  const db = readDB();
  db.history = (db.history || []).filter((h: any) => h.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// AI analysis computation
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { datasetId, promptText, promptName, language, temperature, model } = req.body;
    if (!datasetId || !promptText) {
      return res.status(400).json({ error: "Missing dataset ID or prompt content." });
    }

    const db = readDB();
    const dataset = db.datasets.find((d: any) => d.id === datasetId);
    if (!dataset) {
      return res.status(404).json({ error: "Selected dataset no longer exists." });
    }

    // Prepare dense statistical overview to avoid context blowing & poor LLM calculation
    const statisticsSummary = dataset.columns.map((col: any) => {
      let statsDetail = "";
      if (col.type === 'numeric') {
        statsDetail = `Min: ${col.stats.min}, Max: ${col.stats.max}, Average: ${col.stats.avg}, Sum: ${col.stats.sum}`;
      } else if (col.type === 'categorical' && col.stats.frequencies) {
        statsDetail = `Top classes: ${Object.entries(col.stats.frequencies).map(([k, v]) => `${k} (${v} times)`).join(', ')}`;
      }
      return `- Column "${col.name}" [Type: ${col.type}]. Missing entries: ${col.missingCount}. ${statsDetail}`;
    }).join("\n");

    // Sample the first 150 rows as context representation
    const dataSample = dataset.data.slice(0, 150);

    const systemInstruction = `You are a world-class public policy data scientist and lead researcher at Bharat Insight Studio.
Your role is to analyze Indian public sector datasets (including agriculture, demography, economy, health, or infrastructure) and extract completely factual, deep, and explainable AI insights.

CRITICAL SECURITY AND TRUTHFULNESS MANDATES:
1. STRICT DATA COUPLING: Every observation, figure, count, average, trend, recommendation, and insight you output must trace back DIRECTLY and EXCLUSIVELY to the provided dataset details.
2. NO EXTERNAL FABRICATION: Do not invent rows, extrapolate outside variables, or assume context not present in the data. Never hallucinate numbers.
3. INSUFFICIENT DATA SAFETY: If the user's prompt demands answers or comparisons that cannot be statistically justified using the columns or rows provided, you MUST reply stating exactly: "Not enough data."
4. OUTPUT STRUCTURE: You must output a JSON object adhering exactly to the structure defined below. Do not wrap the JSON output in markdown backticks (\`\`\`json ... \`\`\`). Output raw JSON only.

JSON SCHEMA:
{
  "summary": "A concise executive outline of the findings, including file metrics and overall trend summary.",
  "insights": [
    "Factual insight statement 1 supported by specific numeric figures or classes from the dataset.",
    "Factual insight statement 2 with backing data."
  ],
  "reasoning": "Step-by-step logic of how you verified these calculations or relationships across columns.",
  "evidence": "Exact columns, stats values, or sample rows referenced to form this logic.",
  "confidenceScore": 95, // Numerical score 0-100 indicating statistical validity (deduct for high missing rates, small sample sizes, or missing variables).
  "limitations": "Identify gaps in columns, missing items, small size limits, or other data constraints in this uploaded set.",
  "recommendedActions": [
    "Actionable policy or operational step 1 for planners, researchers, or administrators based solely on this data.",
    "Actionable step 2."
  ],
  "exploreQuestions": [
    "Logical question 1 to explore next if supplementary columns or external data was added.",
    "Logical question 2."
  ]
}

LANGUAGE OUTPUT DIRECTIVE:
You must translate and output all text values (summary, insights list, reasoning, limitations, actions, questions) completely in "${language || 'English'}".`;

    const promptContext = `DATASET NAME: "${dataset.name}"
TOTAL ROWS: ${dataset.rowCount}
TOTAL COLUMNS: ${dataset.colCount}
DUPLICATES COUNT: ${dataset.duplicateCount}
TOTAL MISSING FIELDS: ${dataset.missingCount}

DETAILED COLUMN STATISTICS:
${statisticsSummary}

DATASET SAMPLE REPRESENTATION (First 150 Rows):
${JSON.stringify(dataSample, null, 2)}

=======================================
USER PROMPT COMMAND:
"${promptText}"
=======================================`;

    const client = getGeminiClient();
    const result = await client.models.generateContent({
      model: model || "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: temperature !== undefined ? Number(temperature) : 0.4,
        responseMimeType: "application/json"
      }
    });

    const outputText = result.text;
    if (!outputText) {
      throw new Error("Gemma Model generated an empty response.");
    }

    // Clean JSON response from potential markdown wrapping safely
    let cleanedOutput = outputText.trim();
    if (cleanedOutput.startsWith("```")) {
      cleanedOutput = cleanedOutput.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanedOutput);
    } catch (parseErr) {
      // Fallback object if parser fails to output correct JSON schema
      console.warn("JSON parse failed, formatting fallback:", cleanedOutput);
      aiResponse = {
        summary: outputText,
        insights: ["Direct answer produced by the intelligence model."],
        reasoning: "Heuristic extraction of plain text model output.",
        evidence: `Dataset context: ${dataset.name}`,
        confidenceScore: 75,
        limitations: "Could not structure the analytics strictly into JSON schema.",
        recommendedActions: ["Review textual response summary."],
        exploreQuestions: ["Verify prompt constraints."]
      };
    }

    const historyItem = {
      id: "hist_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      datasetId,
      datasetName: dataset.name,
      promptName,
      promptText,
      response: aiResponse,
      language: language || "English",
      model: model || "gemini-3.5-flash",
      temperature: temperature || 0.4
    };

    // Save history
    db.history = db.history || [];
    db.history.unshift(historyItem);
    writeDB(db);

    res.json(historyItem);
  } catch (error: any) {
    console.error("AI Insight Engine Failure:", error);
    res.status(500).json({ error: error.message || "An error occurred in Gemma Analysis Studio." });
  }
});

// Custom Prompt Builders
app.get("/api/prompts", (req, res) => {
  const db = readDB();
  res.json(db.customPrompts || []);
});

app.post("/api/prompts", (req, res) => {
  const db = readDB();
  const newPrompt = {
    id: "prompt_" + Math.random().toString(36).substr(2, 9),
    ...req.body,
    isCustom: true
  };
  db.customPrompts = db.customPrompts || [];
  db.customPrompts.push(newPrompt);
  writeDB(db);
  res.status(201).json(newPrompt);
});

app.delete("/api/prompts/:id", (req, res) => {
  const db = readDB();
  db.customPrompts = (db.customPrompts || []).filter((p: any) => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Reports Generator
app.get("/api/reports", (req, res) => {
  const db = readDB();
  res.json(db.reports || []);
});

app.post("/api/reports", (req, res) => {
  const db = readDB();
  const newReport = {
    id: "rep_" + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  db.reports = db.reports || [];
  db.reports.unshift(newReport);
  writeDB(db);
  res.status(201).json(newReport);
});

app.delete("/api/reports/:id", (req, res) => {
  const db = readDB();
  db.reports = (db.reports || []).filter((r: any) => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ==========================================
// FRONTEND SERVING & VITE DEVELOPMENT MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  listenWithFallback(DEFAULT_PORT, 10);
}

startServer();
