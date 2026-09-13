import React, { useState, useEffect } from "react";
import { STORY_SCENES } from "../data/storyData";
import { StoryScene, DialogueChoice } from "../types";
import { BackgroundScene, TariqSprite, AyeshaSprite } from "./VisualSprites";
import { playSfx, playAmbientBgm } from "../utils/audio";
import { Play, RotateCcw, FastForward, Volume2, VolumeX, BookOpen, Sparkles, Film, ArrowRight, History, Award } from "lucide-react";

interface Props {
  activeCutsceneVideoUrl?: string | null;
  onOpenVideoStudio?: () => void;
  onOpenLiveVoice?: () => void;
}

export function VisualNovel({
  activeCutsceneVideoUrl,
  onOpenVideoStudio,
  onOpenLiveVoice,
}: Props) {
  const [currentSceneId, setCurrentSceneId] = useState<string>("intro_1");
  const [history, setHistory] = useState<StoryScene[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showCutsceneModal, setShowCutsceneModal] = useState(false);

  const scene: StoryScene = STORY_SCENES[currentSceneId] || STORY_SCENES["intro_1"];

  // Play scene sounds / ambient audio
  useEffect(() => {
    if (scene.sfx && soundEnabled) {
      playSfx(scene.sfx as any);
    }
    if (scene.ambientSound && soundEnabled) {
      playAmbientBgm(scene.ambientSound, soundEnabled);
    }

    // Check for unlocked ending
    if (scene.id.startsWith("ending_") && !unlockedEndings.includes(scene.id)) {
      setUnlockedEndings((prev) => [...prev, scene.id]);
    }
  }, [scene.id, soundEnabled]);

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (autoPlay && scene.nextSceneId && !scene.choices) {
      timer = setTimeout(() => {
        handleNextScene();
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoPlay, scene]);

  const handleNextScene = () => {
    if (scene.nextSceneId) {
      playSfx("page");
      setHistory((prev) => [...prev, scene]);
      setCurrentSceneId(scene.nextSceneId);
    }
  };

  const handleSelectChoice = (choice: DialogueChoice) => {
    playSfx("click");
    setHistory((prev) => [...prev, scene]);
    setCurrentSceneId(choice.nextSceneId);
  };

  const handleRestart = () => {
    playSfx("click");
    setCurrentSceneId("intro_1");
    setHistory([]);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    playAmbientBgm(scene.ambientSound || "library", next);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Bar / Quick Actions */}
      <div className="relative z-20 bg-slate-900/90 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              {scene.title}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Air University Islamabad
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeCutsceneVideoUrl && (
            <button
              onClick={() => setShowCutsceneModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-medium transition"
            >
              <Film className="w-3.5 h-3.5" />
              Watch Video Cutscene
            </button>
          )}

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded-lg text-xs font-medium border transition ${
              autoPlay
                ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Auto-Play"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            title={soundEnabled ? "Mute BGM/SFX" : "Unmute"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            title="Dialogue Log"
          >
            <History className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition"
            title="Restart Novel"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Stage (Background + Character Sprites) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[360px] overflow-hidden flex items-end justify-between px-6 sm:px-14 pb-4 select-none">
        {/* Render Background Scene */}
        <BackgroundScene backgroundId={scene.background} />

        {/* Rainbow Particles or Flash if Rainbow Reveal */}
        {scene.isRainbowReveal && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse pointer-events-none z-10"></div>
        )}

        {/* Tariq on the Left */}
        <div className="relative z-10 transform translate-y-4">
          <TariqSprite expression={scene.tariqExpression} />
        </div>

        {/* Ayesha on the Right (appears from confrontation onwards) */}
        {scene.ayeshaExpression && (
          <div className="relative z-10 transform translate-y-4">
            <AyeshaSprite expression={scene.ayeshaExpression} />
          </div>
        )}
      </div>

      {/* Dialogue Box & Interactive Choice Controls */}
      <div className="relative z-20 bg-slate-950/95 border-t border-slate-800 p-5 sm:p-6 shadow-2xl">
        {/* Choices if any */}
        {scene.choices && scene.choices.length > 0 ? (
          <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Make Your Decision for Tariq:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scene.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full text-left p-3.5 rounded-xl border border-indigo-500/50 bg-indigo-950/70 hover:bg-indigo-900/90 text-slate-100 text-xs sm:text-sm font-medium transition shadow-lg flex items-center justify-between group"
                >
                  <span>{choice.text}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Speaker Name Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
              scene.speakerId === "tariq"
                ? "bg-sky-900 border border-sky-400/50 text-sky-200"
                : scene.speakerId === "ayesha"
                ? "bg-rose-900 border border-rose-400/50 text-rose-200"
                : scene.speakerId === "bilal"
                ? "bg-amber-900 border border-amber-400/50 text-amber-200"
                : "bg-slate-800 border border-slate-700 text-slate-300"
            }`}
          >
            {scene.speaker}
          </span>
          {scene.isIncitingIncident && (
            <span className="text-[10px] bg-red-950/80 border border-red-500/50 text-red-300 px-2 py-0.5 rounded font-mono">
              ⚡ INCITING INCIDENT
            </span>
          )}
        </div>

        {/* Dialogue Body */}
        <div
          onClick={scene.nextSceneId && !scene.choices ? handleNextScene : undefined}
          className={`min-h-[70px] text-slate-100 text-sm sm:text-base leading-relaxed cursor-pointer select-none font-sans ${
            scene.speakerId === "tariq" ? "italic text-sky-100" : ""
          }`}
        >
          {scene.text}
        </div>

        {/* Bottom Control Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              🎒 Items: <strong className="text-slate-300 font-normal">Aerodynamics Textbook, Silk Rainbow Flag</strong>
            </span>
            <span>•</span>
            <span>
              🏆 Endings Unlocked: <strong className="text-emerald-400">{unlockedEndings.length} / 3</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scene.nextSceneId && !scene.choices && (
              <button
                onClick={handleNextScene}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {scene.id.startsWith("ending_") && (
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again & Try Other Choices</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History / Dialogue Log Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Visual Novel Dialogue Log
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No previous dialogue yet.</p>
              ) : (
                history.map((h, i) => (
                  <div key={i} className="text-xs space-y-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-300">{h.speaker}:</span>
                    <p className="text-slate-400">{h.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cutscene Video Modal */}
      {showCutsceneModal && activeCutsceneVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-400" />
                Veo 3 Inciting Incident Cutscene
              </h3>
              <button
                onClick={() => setShowCutsceneModal(false)}
                className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close Cutscene
              </button>
            </div>
            <div className="py-4">
              <video
                src={activeCutsceneVideoUrl}
                controls
                autoPlay
                className="w-full aspect-video rounded-xl bg-black object-contain border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
