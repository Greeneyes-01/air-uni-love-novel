import React, { useState, useEffect, useRef } from "react";
import { AspectRatio, VideoJob } from "../types";
import { playSfx } from "../utils/audio";
import { Video, Sparkles, Film, Download, RefreshCw, AlertCircle, Play, CheckCircle2, Sliders, Info, Eye } from "lucide-react";

interface Props {
  onInsertCutscene?: (videoUrl: string) => void;
  onOpenNovel?: () => void;
}

const DEFAULT_INCITING_PROMPT =
  "Cinematic visual novel cutscene: A quiet male student with neat black hair and wire-frame glasses is studying in the Central Library of Air University Islamabad with the scenic Margalla Hills visible through huge panoramic glass windows. He is discovering university features. Suddenly a dramatic girl approaches his desk and tearfully asks if he is single. He freezes and stays silent, staring down intently at his thick book. The girl starts crying intensely, threatening that if he does not say yes she will leave the university campus forever, but he remains completely silent. In slow motion, he smoothly reveals a vibrant rainbow pride flag from his notebook and sprints away across campus in comedic anime visual novel style. 1080p, expressive anime cinematography, high quality.";

const PRESET_PROMPTS = [
  {
    title: "1. The Inciting Incident (Full Sequence)",
    prompt: DEFAULT_INCITING_PROMPT,
    tag: "Original Prompt",
  },
  {
    title: "2. Exploring Campus Features",
    prompt:
      "A young Pakistani student with black hair and glasses carrying an engineering textbook walking through Air University Islamabad, exploring the C-Block Avionics wind tunnel lab, modern high-tech research centers, and the Margalla Concourse courtyard under golden morning sunlight. Cinematic drone and eye-level shots.",
    tag: "Campus Tour",
  },
  {
    title: "3. Library Confrontation & Tears",
    prompt:
      "Dramatic visual novel scene: In the quiet study hall of Air University Central Library, a girl with teary eyes confronts a shy black-haired student with glasses. He looks down at his book in dead silence while she cries and begs him not to make her leave campus forever. Tense emotional lighting.",
    tag: "Drama",
  },
  {
    title: "4. The Rainbow Flag Sprint",
    prompt:
      "Hilarious anime visual novel action sequence: A nerdy university student with black hair and glasses waving a small silk rainbow flag triumphantly, sprinting at top speed past bookshelves, down university stairs, and across the PAF jet monument lawn at Air University Islamabad.",
    tag: "Comedy & Action",
  },
];

export function VeoVideoStudio({ onInsertCutscene, onOpenNovel }: Props) {
  const [prompt, setPrompt] = useState(DEFAULT_INCITING_PROMPT);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [resolution, setResolution] = useState<"720p" | "1080p">("720p");
  const [modelName, setModelName] = useState("veo-3.1-fast-generate-preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [currentJob, setCurrentJob] = useState<VideoJob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [canvasPlaying, setCanvasPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Polling for video operation status
  useEffect(() => {
    let timer: any = null;
    if (isGenerating && currentJob?.operationName) {
      const reassuranceMessages = [
        "Initializing Veo 3 engine (veo-3.1-fast-generate-preview)...",
        "Synthesizing Air University Islamabad Central Library...",
        "Simulating black-haired student with glasses studying aerodynamics...",
        "Rendering Ayesha's dramatic entrance & library tears...",
        "Animating the iconic rainbow flag reveal & campus sprint...",
        "Polishing cinematic camera motion & Margalla Hills lighting...",
        "Video models take a couple of minutes to synthesize frames...",
      ];
      let msgIdx = 0;

      const checkStatus = async () => {
        try {
          msgIdx = (msgIdx + 1) % reassuranceMessages.length;
          setGenerationStep(reassuranceMessages[msgIdx]);

          const res = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName: currentJob.operationName }),
          });
          const data = await res.json();

          if (data.error) {
            setErrorMsg(data.error.message || "Video generation encountered an error");
            setIsGenerating(false);
            return;
          }

          if (data.done) {
            setIsGenerating(false);
            setGenerationStep("Video generation complete! Downloading stream...");
            // Trigger download/fetch video
            const downloadRes = await fetch("/api/video-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationName: currentJob.operationName }),
            });

            if (downloadRes.ok) {
              const blob = await downloadRes.blob();
              const objectUrl = URL.createObjectURL(blob);
              setDownloadUrl(objectUrl);
              setCurrentJob((prev) => (prev ? { ...prev, status: "completed", videoUrl: objectUrl } : null));
              playSfx("chime");
            } else {
              const err = await downloadRes.json();
              setErrorMsg(err.error || "Failed to download generated video");
            }
          } else {
            timer = setTimeout(checkStatus, 7000);
          }
        } catch (err: any) {
          console.error("Polling error:", err);
          timer = setTimeout(checkStatus, 10000);
        }
      };

      timer = setTimeout(checkStatus, 6000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isGenerating, currentJob?.operationName]);

  const handleStartGeneration = async () => {
    if (!prompt.trim()) return;
    playSfx("click");
    setIsGenerating(true);
    setErrorMsg(null);
    setDownloadUrl(null);
    setGenerationStep("Sending prompt to Veo 3 (veo-3.1-fast-generate-preview)...");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
          model: modelName,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to start video generation");
      }

      setCurrentJob({
        operationName: data.operationName,
        prompt,
        aspectRatio,
        status: "generating",
        createdAt: Date.now(),
      });
      setGenerationStep("Generation started! Synthesizing scene...");
    } catch (err: any) {
      console.error("Start generation error:", err);
      setIsGenerating(false);
      setErrorMsg(
        err.message ||
          "Could not initialize Veo 3 video generation. Make sure GEMINI_API_KEY is configured in Settings > Secrets."
      );
    }
  };

  // Canvas-based interactive animated simulation of the scene for instant preview
  const startCanvasCutscene = () => {
    setCanvasPlaying(true);
    playSfx("shock");
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Background: Air University Library & Margalla Hills
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(0.4, "#a7f3d0");
      grad.addColorStop(0.7, "#1e293b");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Mountains
      ctx.fillStyle = "#1e3a29";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.4);
      ctx.quadraticCurveTo(w * 0.3, h * 0.25, w * 0.6, h * 0.35);
      ctx.quadraticCurveTo(w * 0.8, h * 0.28, w, h * 0.38);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Window frames
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.33, 0);
      ctx.lineTo(w * 0.33, h * 0.6);
      ctx.moveTo(w * 0.66, 0);
      ctx.lineTo(w * 0.66, h * 0.6);
      ctx.stroke();

      // Study desk
      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      // Student with glasses and black hair
      const studentX = frame < 180 ? w * 0.35 : w * 0.35 + (frame - 180) * 4;
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(studentX, h * 0.52, 28, 0, Math.PI * 2);
      ctx.fill();

      // Black hair
      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.arc(studentX, h * 0.49, 30, Math.PI, Math.PI * 2);
      ctx.fill();

      // Glasses
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(studentX - 18, h * 0.5, 14, 10);
      ctx.strokeRect(studentX + 4, h * 0.5, 14, 10);

      // Book
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(studentX - 22, h * 0.63, 44, 26);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "8px sans-serif";
      ctx.fillText("AERODYNAMICS", studentX - 20, h * 0.67);

      // Girl (Ayesha)
      if (frame > 30) {
        const girlX = w * 0.68;
        ctx.fillStyle = "#be123c";
        ctx.beginPath();
        ctx.arc(girlX, h * 0.5, 26, 0, Math.PI * 2);
        ctx.fill();

        // Tears
        if (frame > 70) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(girlX - 8, h * 0.53 + ((frame * 2) % 20), 3, 0, Math.PI * 2);
          ctx.arc(girlX + 8, h * 0.53 + (((frame * 2) + 10) % 20), 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Speech bubble
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(girlX - 90, h * 0.3 - 25, 180, 45, 8);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 10px sans-serif";
        if (frame < 120) {
          ctx.fillText("ARE YOU SINGLE?!", girlX - 55, h * 0.3 - 5);
          ctx.font = "9px sans-serif";
          ctx.fillText("Say yes or I leave AU campus!", girlX - 75, h * 0.3 + 10);
        } else {
          ctx.fillText("I'M LEAVING FOREVER! 😭", girlX - 65, h * 0.3 - 5);
        }
      }

      // Rainbow flag reveal (frame > 140)
      if (frame > 140) {
        const flagX = studentX + 15;
        const flagY = h * 0.42;

        const colors = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#7c3aed"];
        colors.forEach((col, i) => {
          ctx.fillStyle = col;
          ctx.fillRect(flagX, flagY + i * 4, 30, 4);
        });

        // Flagpole
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flagX, flagY - 4);
        ctx.lineTo(flagX, flagY + 28);
        ctx.stroke();

        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("🏳️‍🌈 *SILENT RUN!*", studentX - 30, h * 0.38);
      }

      // Subtitles
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(10, h - 35, w - 20, 28);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px sans-serif";
      let caption = "Tariq is studying silently at Air University Islamabad Central Library...";
      if (frame > 40 && frame <= 100) caption = "Ayesha storms in: 'Are you single?! Tell me right now!'";
      if (frame > 100 && frame <= 140) caption = "Tariq stays completely silent. Ayesha starts crying uncontrollably!";
      if (frame > 140 && frame <= 180) caption = "Tariq pulls out a rainbow flag without breaking eye contact...";
      if (frame > 180) caption = "Tariq runs away at supersonic speed across Sector E-9!";
      ctx.fillText(caption, 20, h - 17);

      if (frame < 300) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        setCanvasPlaying(false);
      }
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Veo 3 Video Studio</h2>
              <span className="bg-purple-900/70 border border-purple-400/40 text-purple-200 text-xs px-2.5 py-0.5 rounded-full font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Generate the inciting incident video at Air University Islamabad with Veo 3
            </p>
          </div>
        </div>

        <button
          onClick={startCanvasCutscene}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition border border-slate-700"
        >
          <Eye className="w-4 h-4 text-sky-400" />
          Preview Scene Animation
        </button>
      </div>

      {/* Main Grid: Generator Controls & Video Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Form & Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Prompts Carousel */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Story Inciting Incident Prompts
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSfx("click");
                    setPrompt(p.prompt);
                  }}
                  className={`text-left p-3 rounded-xl border text-xs transition ${
                    prompt === p.prompt
                      ? "bg-indigo-950/80 border-indigo-500 text-indigo-200"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-semibold text-slate-100 flex items-center justify-between">
                    <span>{p.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      {p.tag}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[11px] text-slate-400 mt-1">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Video Prompt Description
              </label>
              <span className="text-xs text-slate-500 font-mono">{prompt.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              placeholder="Describe the Air University scene, character expressions, actions..."
            />
          </div>

          {/* Aspect Ratio & Resolution Bar (Mandatory Veo 3 Requirement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Aspect Ratio Selector: 16:9 (landscape) or 9:16 (portrait) */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Aspect Ratio (Veo 3)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setAspectRatio("16:9");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium border transition ${
                    aspectRatio === "16:9"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-4 h-2.5 border border-current rounded-sm"></span>
                  16:9 Landscape
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setAspectRatio("9:16");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium border transition ${
                    aspectRatio === "9:16"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-2.5 h-4 border border-current rounded-sm"></span>
                  9:16 Portrait
                </button>
              </div>
            </div>

            {/* Resolution Selector: 720p or 1080p */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Resolution Quality
              </span>
              <div className="flex gap-2">
                {(["720p", "1080p"] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setResolution(res);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border transition ${
                      resolution === res
                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {res} HD
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleStartGeneration}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition shadow-xl ${
              isGenerating
                ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Generating Veo 3 Video ({aspectRatio})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Video with Veo 3</span>
              </>
            )}
          </button>

          {/* Information pill */}
          <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Veo 3 Fast Preview:</span> Uses{" "}
              <code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded font-mono">
                veo-3.1-fast-generate-preview
              </code>{" "}
              via server-side endpoints with polling and secure streaming.
            </div>
          </div>
        </div>

        {/* Right Column: Video Player & Output Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Video Output / Cutscene Canvas
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {aspectRatio}
                </span>
              </div>

              {/* Video Screen or Animated Simulation Canvas */}
              <div
                className={`relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 ${
                  aspectRatio === "9:16" ? "aspect-[9/16] max-h-[460px] mx-auto" : "aspect-video"
                }`}
              >
                {downloadUrl ? (
                  <video
                    src={downloadUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : canvasPlaying ? (
                  <canvas ref={canvasRef} width={640} height={360} className="w-full h-full object-contain" />
                ) : isGenerating ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-300">Veo 3 is rendering...</h4>
                      <p className="text-xs text-slate-400 max-w-xs mt-1 animate-pulse leading-relaxed">
                        {generationStep || "Processing scene..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 text-slate-500">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Video className="w-7 h-7 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Ready to Generate Video</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Click "Generate Video" or preview the interactive animation cutscene
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Download MP4 or Insert into Visual Novel */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              {downloadUrl && (
                <div className="space-y-2">
                  <a
                    href={downloadUrl}
                    download="air-university-inciting-incident.mp4"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Generated MP4 Video
                  </a>
                  {onInsertCutscene && (
                    <button
                      onClick={() => onInsertCutscene(downloadUrl)}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700"
                    >
                      <Film className="w-4 h-4 text-purple-400" />
                      Set as Visual Novel Cutscene
                    </button>
                  )}
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice: </span>
                    {errorMsg}
                    <div className="mt-1 text-[11px] text-red-400/90">
                      You can also use the "Preview Scene Animation" button to watch the animated cutscene!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
