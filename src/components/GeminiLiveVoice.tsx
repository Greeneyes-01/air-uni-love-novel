import React, { useState, useEffect, useRef } from "react";
import { CharacterId, LiveVoiceMessage } from "../types";
import {
  playSfx,
  pcmToBase64,
  playLivePcmChunk,
  resetLivePlayback,
  getAudioContext,
} from "../utils/audio";
import { Mic, MicOff, Volume2, PhoneCall, PhoneOff, Radio, Send, Sparkles, MessageSquare, User, AlertCircle, Bot } from "lucide-react";

interface Props {
  initialCharacter?: CharacterId;
}

const CHARACTERS: {
  id: CharacterId;
  name: string;
  role: string;
  avatarText: string;
  defaultVoice: string;
  bio: string;
  suggestedPrompts: string[];
}[] = [
  {
    id: "tariq",
    name: "Tariq Ahmed",
    role: "Aerospace Freshman (Black Hair & Glasses)",
    avatarText: "👓",
    defaultVoice: "Zephyr",
    bio: "Studies aerodynamics at AU Islamabad. Famous for staring at his book in dead silence, waving a rainbow flag, and sprinting away!",
    suggestedPrompts: [
      "Why did you stay silent when Ayesha asked if you were single?",
      "Where did you get that rainbow flag from?",
      "Which campus feature of Air University is your favorite?",
    ],
  },
  {
    id: "ayesha",
    name: "Ayesha Noor",
    role: "Dramatic Student & Viral Confessor",
    avatarText: "🌹",
    defaultVoice: "Kore",
    bio: "The girl who caused the library commotion, broke down crying, and threatened to leave campus forever.",
    suggestedPrompts: [
      "Why did you start crying in the middle of the library?",
      "Were you really going to leave Air University forever?",
      "What was your reaction when Tariq pulled out the rainbow flag?",
    ],
  },
  {
    id: "guide",
    name: "AU Campus Ambassador",
    role: "Air University Islamabad Guide",
    avatarText: "🏛️",
    defaultVoice: "Puck",
    bio: "Guide to the PAF Complex campus in Sector E-9, C-Block avionics labs, and Margalla Hills scenery.",
    suggestedPrompts: [
      "Tell me about Air University's aerospace & avionics facilities.",
      "What is the story behind the fighter jet monument on campus?",
      "How close is the campus to the Margalla Hills?",
    ],
  },
];

const VOICES = ["Zephyr", "Puck", "Kore", "Fenrir", "Charon"];

export function GeminiLiveVoice({ initialCharacter = "tariq" }: Props) {
  const [selectedChar, setSelectedChar] = useState<CharacterId>(initialCharacter);
  const [selectedVoice, setSelectedVoice] = useState<string>("Zephyr");
  const [isConnected, setIsConnected] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<LiveVoiceMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [statusNote, setStatusNote] = useState<string>("Disconnected");
  const [errorNote, setErrorNote] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioInputCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeCharacterInfo = CHARACTERS.find((c) => c.id === selectedChar) || CHARACTERS[0];

  useEffect(() => {
    setSelectedVoice(activeCharacterInfo.defaultVoice);
  }, [selectedChar]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect to Gemini Live WebSocket
  const handleConnect = () => {
    if (isConnected) {
      handleDisconnect();
      return;
    }

    playSfx("click");
    setErrorNote(null);
    setStatusNote("Connecting to Gemini Live (gemini-3.1-flash-live-preview)...");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/live-ws?character=${selectedChar}&voice=${selectedVoice}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setStatusNote(`Live API Connected as ${activeCharacterInfo.name} (${selectedVoice})`);
        playSfx("chime");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "system",
            text: `🎙️ Live voice session established with ${activeCharacterInfo.name} using model gemini-3.1-flash-live-preview. Speak into your microphone or type below!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorNote(msg.error);
            setStatusNote("Live API Error");
          }

          if (msg.interrupted) {
            resetLivePlayback();
            setIsAiSpeaking(false);
          }

          if (msg.audio) {
            setIsAiSpeaking(true);
            playLivePcmChunk(msg.audio);
          }

          if (msg.outputText) {
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.sender === "character") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, text: lastMsg.text + " " + msg.outputText },
                ];
              }
              return [
                ...prev,
                {
                  id: Date.now().toString(),
                  sender: "character",
                  text: msg.outputText,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ];
            });
          }
        } catch (e) {
          console.error("WS message parse error:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        setErrorNote("Could not connect to Live API session. Ensure GEMINI_API_KEY is active in Settings.");
        setStatusNote("Connection Failed");
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsMicActive(false);
        setIsAiSpeaking(false);
        stopMicrophone();
        setStatusNote("Session Closed");
      };
    } catch (err: any) {
      console.error("Connect error:", err);
      setErrorNote(err.message || "Failed to initialize WebSocket");
    }
  };

  const handleDisconnect = () => {
    playSfx("click");
    stopMicrophone();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsAiSpeaking(false);
    setStatusNote("Disconnected");
  };

  // Start microphone streaming (16kHz PCM little-endian little-endian Base64)
  const startMicrophone = async () => {
    try {
      playSfx("click");
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioInputCtxRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const channelData = e.inputBuffer.getChannelData(0);
        const base64Audio = pcmToBase64(channelData);
        wsRef.current.send(JSON.stringify({ audio: base64Audio }));
      };

      setIsMicActive(true);
      setStatusNote("Microphone Active (Streaming 16kHz PCM)");
    } catch (err: any) {
      console.error("Mic access error:", err);
      setErrorNote("Microphone permission was denied or unavailable. You can still chat by typing below!");
      setIsMicActive(false);
    }
  };

  const stopMicrophone = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioInputCtxRef.current) {
      audioInputCtxRef.current.close().catch(() => {});
      audioInputCtxRef.current = null;
    }
    setIsMicActive(false);
  };

  const toggleMic = () => {
    if (isMicActive) {
      stopMicrophone();
      setStatusNote("Microphone Paused");
    } else {
      startMicrophone();
    }
  };

  // Send typed prompt / message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || textInput).trim();
    if (!textToSend) return;
    playSfx("click");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setTextInput("");

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: textToSend }));
    } else {
      // Fallback REST endpoint /api/chat
      try {
        setStatusNote("Sending via Gemini 3.8 Flash...");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            character: selectedChar,
            message: textToSend,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "character",
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setStatusNote("Ready");
        }
      } catch (e: any) {
        setErrorNote(e.message || "Failed to send chat message");
      }
    }
  };

  // Canvas audio visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      phase += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Grid line
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const bars = 36;
      const barWidth = w / bars - 2;

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + 2);
        let amplitude = 4;

        if (isMicActive) {
          amplitude = Math.sin(phase + i * 0.4) * 22 + Math.cos(phase * 1.5 + i * 0.3) * 15 + 10;
        } else if (isAiSpeaking) {
          amplitude = Math.sin(phase * 2 + i * 0.5) * 28 + Math.sin(phase * 3 + i * 0.2) * 18 + 15;
        } else if (isConnected) {
          amplitude = Math.sin(phase * 0.5 + i * 0.2) * 6 + 4;
        }

        amplitude = Math.max(2, Math.min(amplitude, h / 2 - 4));

        const grad = ctx.createLinearGradient(0, h / 2 - amplitude, 0, h / 2 + amplitude);
        if (isAiSpeaking) {
          grad.addColorStop(0, "#a855f7");
          grad.addColorStop(1, "#3b82f6");
        } else if (isMicActive) {
          grad.addColorStop(0, "#10b981");
          grad.addColorStop(1, "#06b6d4");
        } else {
          grad.addColorStop(0, "#475569");
          grad.addColorStop(1, "#334155");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, h / 2 - amplitude, barWidth, amplitude * 2);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isConnected, isMicActive, isAiSpeaking]);

  useEffect(() => {
    return () => {
      stopMicrophone();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Gemini Live Voice Room</h2>
              <span className="bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                gemini-3.1-flash-live-preview
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Have real-time voice conversations with Tariq, Ayesha, or the Air University Guide
            </p>
          </div>
        </div>

        {/* Call Button */}
        <button
          onClick={handleConnect}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
            isConnected
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
          }`}
        >
          {isConnected ? (
            <>
              <PhoneOff className="w-4 h-4" />
              Disconnect Call
            </>
          ) : (
            <>
              <PhoneCall className="w-4 h-4" />
              Start Live Voice Call
            </>
          )}
        </button>
      </div>

      {/* Grid: Character Selector & Call Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Sidebar: Character and Voice settings (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Character to Converse With
            </label>
            <div className="space-y-2">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    playSfx("click");
                    setSelectedChar(char.id);
                    if (isConnected) {
                      handleDisconnect();
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedChar === char.id
                      ? "bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-md"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{char.avatarText}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-100 text-sm">{char.name}</div>
                      <div className="text-[11px] text-slate-400">{char.role}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{char.bio}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Live Synthesizer Voice
            </label>
            <div className="flex flex-wrap gap-1.5">
              {VOICES.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    playSfx("click");
                    setSelectedVoice(v);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    selectedVoice === v
                      ? "bg-cyan-600 border-cyan-400 text-white shadow-sm"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Quick Questions */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Suggested Questions
            </label>
            <div className="space-y-1.5">
              {activeCharacterInfo.suggestedPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-indigo-300 transition line-clamp-1"
                >
                  💬 "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area: Active Voice Session & Transcript (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[440px]">
          {/* Active Call Status Bar & Audio Visualizer */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCharacterInfo.avatarText}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    {activeCharacterInfo.name}
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        LIVE
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{statusNote}</p>
                </div>
              </div>

              {/* Mic toggle button if connected */}
              {isConnected && (
                <button
                  onClick={toggleMic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    isMicActive
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 animate-pulse"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isMicActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                  {isMicActive ? "Mic Live (Streaming)" : "Unmute Mic"}
                </button>
              )}
            </div>

            {/* Audio Waveform Canvas */}
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-800">
              <canvas ref={canvasRef} width={500} height={50} className="w-full h-12 block" />
            </div>
          </div>

          {/* Transcript Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">
                  Click "Start Live Voice Call" or type below to speak with {activeCharacterInfo.name}.
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  The model will stream synthesized voice back in real time via WebSockets and 24kHz PCM audio.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "user"
                      ? "items-end"
                      : m.sender === "system"
                      ? "items-center"
                      : "items-start"
                  }`}
                >
                  {m.sender === "system" ? (
                    <div className="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] px-3 py-1.5 rounded-full text-center max-w-md my-1">
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-semibold text-[10px] opacity-75">
                        {m.sender === "user" ? <User className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
                        <span>{m.sender === "user" ? "You" : activeCharacterInfo.name}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input Prompt Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            {errorNote && (
              <div className="mb-2 p-2 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorNote}</span>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Ask ${activeCharacterInfo.name} a question...`}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-xl text-xs transition flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
