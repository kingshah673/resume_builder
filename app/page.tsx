"use client";

import { useState, useEffect } from "react";
import PDFWrapper from "@/components/PDFWrapper";
import { ResumeData } from "@/types/resume";

export default function Home() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [dataStr, setDataStr] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServerReady, setIsServerReady] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");

  // Poll for AI server readiness on mount
  useEffect(() => {
    let retryCount = 0;
    const checkServer = async () => {
      // Try both localhost and 127.0.0.1 for maximum compatibility
      const hosts = ["http://127.0.0.1:8000", "http://localhost:8000"];

      for (const host of hosts) {
        try {
          setConnectionStatus(`Checking ${host}...`);
          const res = await fetch(`${host}/health`, {
            mode: 'cors',
            cache: 'no-cache'
          });
          if (res.ok) {
            const status = await res.json();
            if (status.status === "ready") {
              setIsServerReady(true);
              return true;
            }
          }
        } catch {
          // If both fail, update status
          if (host === hosts[hosts.length - 1]) {
            retryCount++;
            setConnectionStatus(`Connection failed. Retry #${retryCount}...`);
          }
        }
      }
      return false;
    };

    checkServer();
    const interval = setInterval(async () => {
      const ready = await checkServer();
      if (ready) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsLoading(true);
    setServerError(null);

    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileBase64: base64,
            filename: file.name
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ message: "Unknown error" }));
          console.error("API Error Response:", errData);
          setServerError(`Upload failed: ${errData.message || "Is the Python server running?"}`);
          return;
        }

        const result = await res.json();
        const parsedData = result.parsed as ResumeData;

        if (parsedData && parsedData.error) {
          setServerError(`AI parsing failed: ${parsedData.message || "Please check your Gemini API key"}`);
          return;
        }

        setData(parsedData);
        setDataStr(JSON.stringify(parsedData, null, 2));
      } catch (error: unknown) {
        console.error("Upload process failed", error);
        setServerError((error as Error).message || "Network error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleDataChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDataStr(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setData(parsed);
    } catch {
      // Keep data object as-is if JSON is currently invalid
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Resume Builder
            </h1>
          </div>
          <a
            href="/guide"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Resume Guide
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Professional AI Resume Extractor
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powered by <span className="font-semibold text-indigo-600">Hugging Face AI</span>.
            Experience industrial-grade accuracy and instant parsing for your professional career.
          </p>
        </div>

        {serverError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-in slide-in-from-top-2">
            <p className="font-bold mb-1">Attention Required</p>
            <p>{serverError}</p>
          </div>
        )}

        {!data && (
          <div className="relative">
            {!isServerReady && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 border border-slate-200 shadow-sm animate-in fade-in duration-300">
                <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center px-4">
                  <h3 className="font-bold text-slate-800">Waking up Hugging Face AI</h3>
                  <p className="text-sm text-slate-500 mb-2">Connecting to free inference services...</p>
                  <code className="text-[10px] bg-slate-100 p-1 rounded text-slate-400">{connectionStatus}</code>
                </div>
                <button
                  onClick={() => setIsServerReady(true)}
                  className="mt-4 text-xs text-indigo-600 hover:text-indigo-800 underline font-medium"
                >
                  Taking too long? Click here to bypass check.
                </button>
              </div>
            )}

            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300 relative group shadow-sm">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isLoading || !isServerReady}
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className={`p-4 rounded-full ${isLoading ? 'bg-indigo-100 animate-pulse' : 'bg-slate-100 group-hover:bg-indigo-100 transition-colors'}`}>
                  {isLoading ? (
                    <svg className="w-8 h-8 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-700">
                    {isLoading ? 'Extracting with AI...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Free Hugging Face Inference Active</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Extracted Data
              </h3>
              <button
                onClick={() => setData(null)}
                className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Start Over
              </button>
            </div>
            <div className="p-0 border-b border-slate-700 flex flex-col">
              <div className="bg-slate-700 text-xs text-slate-400 px-6 py-2">
                Edit the JSON below to update the PDF in real-time. Make sure it stays valid JSON.
              </div>
              <textarea
                className="w-full h-96 p-6 bg-slate-800 text-slate-300 text-sm font-mono leading-relaxed focus:outline-none resize-y"
                value={dataStr}
                onChange={handleDataChange}
                spellCheck={false}
              />
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Changes in the editor are reflected in the PDF.
              </p>
              <PDFWrapper data={data} />
            </div>
          </div>
        )}

        {/* Honesty & Transparency Section */}
        <section className="mt-24 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                Our Commitment to Honesty
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We believe in being 100% transparent with you. This tool is designed to save you time,
                but it is powered by AI, which means it is not perfect.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Human-in-the-loop</h4>
                    <p className="text-sm text-slate-500 text-pretty">The AI parses your resume, but you should always review the JSON editor results. We&apos;ve made it easy for you to correct any mistakes.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Privacy First</h4>
                    <p className="text-sm text-slate-500 text-pretty">Your data is processed via Hugging Face&apos;s secure inference API. We do not store your personal resume data on our servers after processing.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-indigo-900 rounded-2xl p-8 text-white shadow-xl">
              <h4 className="text-lg font-bold mb-4">How it works (The Tech)</h4>
              <ul className="space-y-3 text-indigo-100 text-sm">
                <li className="flex gap-2">
                  <span className="text-indigo-400">▹</span>
                  <span>Model: <strong>Qwen2.5-7B-Instruct</strong> via Hugging Face</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">▹</span>
                  <span>Method: Zero-shot JSON extraction</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">▹</span>
                  <span>Safety: No long-term data persistence</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-indigo-800 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Marketing Strategy: Verified Honest</span>
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
