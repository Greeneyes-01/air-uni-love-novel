import React, { useState } from "react";
import { Header, ActiveTab } from "./components/Header";
import { VisualNovel } from "./components/VisualNovel";
import { VeoVideoStudio } from "./components/VeoVideoStudio";
import { GeminiLiveVoice } from "./components/GeminiLiveVoice";
import { CampusMap } from "./components/CampusMap";
import { Film, Radio, Sparkles, BookOpen, Compass, ExternalLink } from "lucide-react";
import { playSfx } from "./utils/audio";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("novel");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeCutsceneVideoUrl, setActiveCutsceneVideoUrl] = useState<string | null>(null);

  const handleInsertCutscene = (videoUrl: string) => {
    setActiveCutsceneVideoUrl(videoUrl);
    setActiveTab("novel");
    playSfx("chime");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Inciting Incident Quick Context Ribbon */}
      <div className="bg-gradient-to-r from-sky-950/80 via-indigo-950/80 to-purple-950/80 border-b border-slate-800/80 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-base select-none">🏳️‍🌈</span>
            <span className="font-semibold text-slate-200">The Inciting Incident:</span>
            <span className="text-slate-400 hidden sm:inline">
              Student with black hair & glasses exploring Air University Islamabad • Cornered in Central Library • Silent Rainbow Flag Escape
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("video");
              }}
              className="inline-flex items-center gap-1.5 text-purple-300 hover:text-purple-200 transition font-medium"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Generate Veo 3 Video</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                playSfx("click");
                setActiveTab("voice");
              }}
              className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition font-medium"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Voice Talk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        {activeTab === "novel" && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <VisualNovel
              activeCutsceneVideoUrl={activeCutsceneVideoUrl}
              onOpenVideoStudio={() => setActiveTab("video")}
              onOpenLiveVoice={() => setActiveTab("voice")}
            />

            {/* Novel Quick Guides */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
              <div
                onClick={() => setActiveTab("video")}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                  <Film className="w-4 h-4" />
                  Veo 3 Video Generator
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Synthesize the library standoff and rainbow escape using model{" "}
                  <code className="text-purple-300 font-mono text-[10px]">veo-3.1-fast-generate-preview</code> in 16:9 or 9:16.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("voice")}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
                  <Radio className="w-4 h-4" />
                  Gemini Live Voice API
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Call Tariq or Ayesha directly with real-time 16kHz PCM audio streaming via{" "}
                  <code className="text-cyan-300 font-mono text-[10px]">gemini-3.1-flash-live-preview</code>.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("campus")}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-1">
                  <Compass className="w-4 h-4" />
                  Air University Campus Map
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Explore C-Block Avionics, the Margalla Concourse, Central Library, and the PAF Fighter Jet monument in Sector E-9.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="w-full max-w-6xl animate-in fade-in duration-300">
            <VeoVideoStudio
              onInsertCutscene={handleInsertCutscene}
              onOpenNovel={() => setActiveTab("novel")}
            />
          </div>
        )}

        {activeTab === "voice" && (
          <div className="w-full max-w-5xl animate-in fade-in duration-300">
            <GeminiLiveVoice />
          </div>
        )}

        {activeTab === "campus" && (
          <div className="w-full max-w-5xl animate-in fade-in duration-300">
            <CampusMap onSelectFeatureForStory={() => setActiveTab("novel")} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-400">Air University Islamabad Chronicles</span> •
            Sector E-9, PAF Complex, Islamabad, Pakistan
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: veo-3.1-fast-generate-preview</span>
            <span>•</span>
            <span>Live: gemini-3.1-flash-live-preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
