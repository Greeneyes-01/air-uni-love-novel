import React from "react";
import { BookOpen, Film, Radio, Navigation, Volume2, VolumeX } from "lucide-react";
import { playSfx } from "../utils/audio";

export type ActiveTab = "novel" | "video" | "voice" | "campus";

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export function Header({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}: Props) {
  const tabs = [
    {
      id: "novel" as const,
      label: "Visual Novel",
      icon: BookOpen,
      desc: "Play the story",
    },
    {
      id: "video" as const,
      label: "Veo 3 Video Studio",
      icon: Film,
      desc: "veo-3.1-fast-generate-preview",
      badge: "Veo 3",
    },
    {
      id: "voice" as const,
      label: "Gemini Live Voice",
      icon: Radio,
      desc: "gemini-3.1-flash-live-preview",
      badge: "Live API",
    },
    {
      id: "campus" as const,
      label: "AU Campus Tour",
      icon: Navigation,
      desc: "Discover Sector E-9",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & University Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <span className="text-xl select-none">✈️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-none">
                  Air University Chronicles
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-950 border border-sky-500/30 text-sky-300">
                  Sector E-9 • Islamabad
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The Inciting Incident: Aerodynamics, Tears, & the Rainbow Flag
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSfx("click");
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sound & Mode Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSfx("click");
              }}
              className={`p-2.5 rounded-xl border transition ${
                soundEnabled
                  ? "bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800"
                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
              title={soundEnabled ? "Mute All Sound" : "Enable Sound & BGM"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1.5 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSfx("click");
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
