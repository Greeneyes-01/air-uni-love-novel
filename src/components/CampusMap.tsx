import React, { useState } from "react";
import { CAMPUS_FEATURES } from "../data/storyData";
import { CampusFeature } from "../types";
import { playSfx } from "../utils/audio";
import { BookOpen, Cpu, Mountain, Coffee, Plane, MapPin, Sparkles, Navigation, Info } from "lucide-react";

interface Props {
  onSelectFeatureForStory?: (featureId: string) => void;
}

export function CampusMap({ onSelectFeatureForStory }: Props) {
  const [selectedFeature, setSelectedFeature] = useState<CampusFeature>(CAMPUS_FEATURES[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      case "Mountain":
        return <Mountain className="w-5 h-5" />;
      case "Coffee":
        return <Coffee className="w-5 h-5" />;
      case "Plane":
        return <Plane className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Air University Islamabad Campus Guide</h2>
              <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                Sector E-9 • PAF Complex
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Discover every landmark and campus feature explored by Tariq before the inciting incident
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Campus Feature List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Discovered Campus Features
          </label>
          {CAMPUS_FEATURES.map((feat) => {
            const isSelected = selectedFeature.id === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => {
                  playSfx("click");
                  setSelectedFeature(feat);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-950/50"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {getIcon(feat.iconName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-100">{feat.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">
                      {feat.urduName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{feat.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Detail Showcase (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs text-emerald-400 font-mono tracking-wider uppercase font-semibold">
                  {selectedFeature.category} Landmark
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{selectedFeature.name}</h3>
                <p className="text-xs text-slate-400 font-serif italic">{selectedFeature.urduName}</p>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400">
                {getIcon(selectedFeature.iconName)}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Overview
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedFeature.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  How Tariq Discovered It
                </h4>
                <p className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/40">
                  🔍 {selectedFeature.discoveryNote}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Connection to the Inciting Incident
                </h4>
                <p className="text-xs text-amber-300/90 leading-relaxed bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
                  ⚡ {selectedFeature.tariqMemory}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Air University Islamabad • E-9 Aerospace Hub
            </span>
            {onSelectFeatureForStory && (
              <button
                onClick={() => onSelectFeatureForStory(selectedFeature.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
              >
                Jump to Scene in Novel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
