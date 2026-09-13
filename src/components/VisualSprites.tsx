import React from "react";
import { TariqExpression, AyeshaExpression, BackgroundId } from "../types";

export function BackgroundScene({ backgroundId }: { backgroundId: BackgroundId }) {
  switch (backgroundId) {
    case "library":
      return (
        <div className="absolute inset-0 bg-slate-900 overflow-hidden pointer-events-none select-none">
          {/* Windows with Margalla Hills backdrop */}
          <div className="absolute top-0 inset-x-0 h-3/5 bg-gradient-to-b from-sky-300 via-emerald-100 to-amber-50 flex items-end">
            <svg className="w-full h-full object-cover opacity-85" viewBox="0 0 1000 400" preserveAspectRatio="none">
              {/* Margalla Hills mountain layers */}
              <path d="M0,280 Q180,140 380,240 T780,160 Q900,210 1000,190 L1000,400 L0,400 Z" fill="#335c43" />
              <path d="M0,310 Q240,210 460,300 T860,250 Q940,280 1000,270 L1000,400 L0,400 Z" fill="#1e3a29" />
              {/* Window mullions / panes */}
              <line x1="200" y1="0" x2="200" y2="400" stroke="#475569" strokeWidth="8" />
              <line x1="400" y1="0" x2="400" y2="400" stroke="#475569" strokeWidth="8" />
              <line x1="600" y1="0" x2="600" y2="400" stroke="#475569" strokeWidth="8" />
              <line x1="800" y1="0" x2="800" y2="400" stroke="#475569" strokeWidth="8" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#475569" strokeWidth="6" />
            </svg>
            <div className="absolute top-4 left-6 bg-slate-900/70 text-slate-200 px-3 py-1 rounded text-xs font-mono tracking-wider backdrop-blur-sm">
              AIR UNIVERSITY • CENTRAL LIBRARY (2ND FL)
            </div>
          </div>
          {/* Mahogany Bookshelves & Warm Study Lamp */}
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-amber-950 via-slate-900 to-slate-800/90 border-t-4 border-amber-800/40">
            <div className="h-full flex justify-between items-end px-6 opacity-35">
              <div className="w-1/4 h-4/5 bg-amber-900/60 rounded-t-lg border-2 border-amber-700/50 flex flex-col justify-around p-2">
                <div className="h-3 bg-amber-600/40 rounded"></div>
                <div className="h-3 bg-amber-500/40 rounded"></div>
                <div className="h-3 bg-amber-600/40 rounded"></div>
              </div>
              <div className="w-1/3 h-1/3 bg-amber-950 rounded-t-xl border-t-4 border-amber-600/70"></div>
              <div className="w-1/4 h-4/5 bg-amber-900/60 rounded-t-lg border-2 border-amber-700/50 flex flex-col justify-around p-2">
                <div className="h-3 bg-emerald-600/40 rounded"></div>
                <div className="h-3 bg-blue-600/40 rounded"></div>
                <div className="h-3 bg-amber-600/40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );

    case "avionics_lab":
      return (
        <div className="absolute inset-0 bg-slate-950 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div className="absolute top-4 left-6 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded text-xs font-mono tracking-wider">
            C-BLOCK: AEROSPACE & AVIONICS LAB • WIND TUNNEL
          </div>
          {/* Digital Telemetry & Radar screens */}
          <div className="absolute top-16 inset-x-8 flex gap-4 opacity-75">
            <div className="flex-1 h-36 bg-slate-900/80 border border-cyan-500/40 rounded-lg p-3 font-mono text-[10px] text-cyan-400">
              <div className="text-xs font-bold text-cyan-300 mb-1 flex items-center justify-between">
                <span>RADAR & TELEMETRY</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <div className="border border-cyan-800/60 rounded h-20 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full border border-cyan-500/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-cyan-500/60"></div>
                </div>
                <div className="absolute text-cyan-500 text-[9px]">AU-E9-PAF</div>
              </div>
            </div>
            <div className="flex-1 h-36 bg-slate-900/80 border border-blue-500/40 rounded-lg p-3 font-mono text-[10px] text-blue-400 hidden sm:block">
              <div className="text-xs font-bold text-blue-300 mb-1">AERODYNAMICS SIM</div>
              <div className="text-emerald-400">MACH: 0.85</div>
              <div className="text-slate-400">AOA: +4.2 deg</div>
              <div className="text-cyan-400">L/D RATIO: 14.8</div>
              <div className="text-amber-400">WIND TUNNEL: ACTIVE</div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-900 to-transparent border-t border-slate-800"></div>
        </div>
      );

    case "courtyard":
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 overflow-hidden pointer-events-none select-none">
          <svg className="w-full h-full object-cover" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Margalla Hills mountains */}
            <path d="M0,280 Q200,120 450,220 T850,150 Q950,200 1000,180 L1000,600 L0,600 Z" fill="#2d5a3f" opacity="0.9" />
            <path d="M0,320 Q280,200 520,310 T920,240 L1000,260 L1000,600 L0,600 Z" fill="#1b3a28" />
            {/* University courtyard pavement & pine trees */}
            <rect x="0" y="420" width="1000" height="180" fill="#e2e8f0" />
            <line x1="0" y1="480" x2="1000" y2="480" stroke="#cbd5e1" strokeWidth="3" />
            {/* Pine Trees */}
            <polygon points="120,440 80,320 160,320" fill="#166534" />
            <polygon points="120,360 90,260 150,260" fill="#15803d" />
            <polygon points="860,430 820,310 900,310" fill="#166534" />
            <polygon points="860,350 830,250 890,250" fill="#15803d" />
          </svg>
          <div className="absolute top-4 left-6 bg-emerald-950/70 text-emerald-200 px-3 py-1 rounded text-xs font-mono tracking-wider backdrop-blur-sm">
            AU ISLAMABAD • MARGALLA VIEW COURTYARD
          </div>
        </div>
      );

    case "cafeteria":
      return (
        <div className="absolute inset-0 bg-amber-950/90 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/60 via-slate-900/80 to-slate-950"></div>
          <div className="absolute top-4 left-6 bg-amber-950/80 border border-amber-500/40 text-amber-300 px-3 py-1 rounded text-xs font-mono tracking-wider">
            AU STUDENT COMMONS • CAFETERIA & CHAI KIOSK
          </div>
          <div className="absolute top-14 inset-x-8 flex justify-between items-center text-amber-200/50 font-serif italic text-lg">
            <span>☕ Hot Karak Chai & Samosas</span>
            <span className="hidden sm:inline">WiFi Zone 4</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-40 bg-amber-950 border-t-8 border-amber-800/80 flex justify-around items-center px-12">
            <div className="w-24 h-24 rounded-full bg-amber-800/50 border-4 border-amber-700/60"></div>
            <div className="w-24 h-24 rounded-full bg-amber-800/50 border-4 border-amber-700/60"></div>
          </div>
        </div>
      );

    case "jet_monument":
      return (
        <div className="absolute inset-0 bg-slate-900 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-900"></div>
          <div className="absolute top-4 left-6 bg-blue-950/80 border border-blue-400/40 text-blue-200 px-3 py-1 rounded text-xs font-mono tracking-wider">
            PAF FIGHTER JET MONUMENT • AIR UNIVERSITY LAWN
          </div>
          {/* Supersonic Jet Silhouette on pedestal */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-72 sm:w-96 h-48 opacity-80" viewBox="0 0 400 200">
              {/* Pedestal */}
              <polygon points="180,180 220,180 210,120 190,120" fill="#475569" />
              {/* Fighter Jet Fuselage */}
              <path d="M60,110 L160,105 L260,95 L340,90 L260,85 L160,88 L60,82 L40,96 Z" fill="#64748b" />
              {/* Delta Wings */}
              <polygon points="170,95 240,40 250,95" fill="#334155" />
              <polygon points="170,100 240,155 250,100" fill="#334155" />
              {/* Tail fin */}
              <polygon points="80,85 50,45 100,85" fill="#475569" />
              {/* Cockpit Canopy */}
              <path d="M220,90 Q250,78 280,90 Z" fill="#38bdf8" opacity="0.85" />
            </svg>
          </div>
        </div>
      );
  }
}

// Tariq Sprite Component
export function TariqSprite({ expression = "studious" }: { expression?: TariqExpression }) {
  const isRunning = expression === "running";
  const isRainbow = expression === "rainbow";

  return (
    <div className={`relative flex flex-col items-center select-none transition-transform duration-300 ${isRunning ? "animate-bounce" : ""}`}>
      {/* Anime Speedlines if running */}
      {isRunning && (
        <div className="absolute -inset-10 flex flex-col justify-around pointer-events-none opacity-80">
          <div className="w-36 h-1 bg-white/70 animate-pulse"></div>
          <div className="w-48 h-1 bg-white/60 ml-8 animate-pulse"></div>
          <div className="w-32 h-1 bg-white/80 animate-pulse"></div>
        </div>
      )}

      {/* Held Item: Rainbow Flag or Thick Textbook */}
      {isRainbow ? (
        <div className="absolute -top-16 -right-12 z-30 animate-pulse flex flex-col items-center">
          <div className="text-[10px] font-bold text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded shadow">
            🏳️‍🌈 RAINBOW REVEAL!
          </div>
          {/* Waving Pride Flag */}
          <div className="relative flex">
            {/* Pole */}
            <div className="w-1.5 h-28 bg-amber-200 rounded-full shadow"></div>
            {/* Flag fabric 6 stripes */}
            <div className="w-24 h-16 rounded-r shadow-lg overflow-hidden flex flex-col border border-white/20">
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-orange-500"></div>
              <div className="flex-1 bg-yellow-400"></div>
              <div className="flex-1 bg-green-600"></div>
              <div className="flex-1 bg-blue-600"></div>
              <div className="flex-1 bg-purple-700"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute -bottom-2 -right-6 z-20 bg-blue-900 border-2 border-amber-400 text-white rounded p-1.5 shadow-md text-[9px] font-mono max-w-[110px] text-center">
          📚 COMPUTATIONAL AERODYNAMICS
        </div>
      )}

      {/* Tariq Avatar SVG Portrait */}
      <svg className="w-48 sm:w-56 h-64 drop-shadow-2xl" viewBox="0 0 200 240">
        {/* Shadow */}
        <ellipse cx="100" cy="230" rx="60" ry="8" fill="#000" opacity="0.3" />

        {/* Shoulders & Jacket (Air University Navy Blazer / Hoodie) */}
        <path d="M40,240 C40,190 70,165 100,165 C130,165 160,190 160,240 Z" fill="#1e293b" />
        {/* Collar & Inner Shirt */}
        <polygon points="100,168 85,195 100,215 115,195" fill="#f8fafc" />
        <polygon points="100,175 92,195 100,210 108,195" fill="#0284c7" />

        {/* Neck */}
        <rect x="88" y="140" width="24" height="30" rx="4" fill="#fbcfe8" />

        {/* Head / Face */}
        <ellipse cx="100" cy="115" rx="42" ry="46" fill="#fce7f3" />
        {/* Ears */}
        <ellipse cx="58" cy="118" rx="6" ry="10" fill="#fbcfe8" />
        <ellipse cx="142" cy="118" rx="6" ry="10" fill="#fbcfe8" />

        {/* Jet Black Hair (anime styled with bangs) */}
        <path
          d="M56,110 C50,60 80,40 100,40 C120,40 150,60 144,110 C136,80 120,70 100,72 C80,70 64,80 56,110 Z"
          fill="#0f172a"
        />
        {/* Forehead Bangs */}
        <polygon points="75,65 85,90 92,68" fill="#0f172a" />
        <polygon points="90,66 100,96 108,66" fill="#0f172a" />
        <polygon points="106,66 115,92 125,65" fill="#0f172a" />

        {/* Rectangular Wire-Frame Glasses */}
        <g stroke="#334155" strokeWidth="2.5" fill="none">
          {/* Left Lens */}
          <rect x="70" y="102" width="26" height="18" rx="3" fill="#e0f2fe" fillOpacity="0.4" />
          {/* Right Lens */}
          <rect x="104" y="102" width="26" height="18" rx="3" fill="#e0f2fe" fillOpacity="0.4" />
          {/* Bridge */}
          <line x1="96" y1="110" x2="104" y2="110" />
          {/* Left/Right Frame Temples */}
          <line x1="58" y1="108" x2="70" y2="108" />
          <line x1="130" y1="108" x2="142" y2="108" />
        </g>

        {/* Glasses Light Glint (Anime trope) */}
        {expression === "reading" || expression === "silent" ? (
          <polygon points="72,104 88,104 76,118 72,118" fill="#ffffff" opacity="0.8" />
        ) : null}

        {/* Eyes behind glasses */}
        {expression === "stunned" ? (
          <>
            <circle cx="83" cy="111" r="3.5" fill="#0f172a" />
            <circle cx="117" cy="111" r="3.5" fill="#0f172a" />
            {/* Sweatdrop */}
            <path d="M136,92 Q142,95 140,102 Q136,106 134,102 Z" fill="#38bdf8" />
          </>
        ) : expression === "reading" || expression === "silent" ? (
          <>
            {/* Looking down at book */}
            <line x1="77" y1="113" x2="89" y2="113" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="111" y1="113" x2="123" y2="113" stroke="#0f172a" strokeWidth="2.5" />
          </>
        ) : (
          <>
            <circle cx="83" cy="110" r="4" fill="#0f172a" />
            <circle cx="84" cy="109" r="1.5" fill="#ffffff" />
            <circle cx="117" cy="110" r="4" fill="#0f172a" />
            <circle cx="118" cy="109" r="1.5" fill="#ffffff" />
          </>
        )}

        {/* Eyebrows */}
        <line
          x1="72"
          y1={expression === "stunned" ? "97" : "100"}
          x2="94"
          y2={expression === "stunned" ? "95" : "99"}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
        <line
          x1="106"
          y1={expression === "stunned" ? "95" : "99"}
          x2="128"
          y2={expression === "stunned" ? "97" : "100"}
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        {/* Mouth */}
        {expression === "running" ? (
          <ellipse cx="100" cy="136" rx="8" ry="6" fill="#be123c" />
        ) : expression === "stunned" ? (
          <ellipse cx="100" cy="135" rx="5" ry="5" fill="#e11d48" />
        ) : (
          <line x1="94" y1="134" x2="106" y2="134" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

// Ayesha Sprite Component
export function AyeshaSprite({ expression = "demanding" }: { expression?: AyeshaExpression }) {
  const isCrying = expression === "crying";
  const isShocked = expression === "shocked";

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Dramatic crying anime water tears */}
      {isCrying && (
        <div className="absolute -top-6 inset-x-0 flex justify-around pointer-events-none z-30">
          <span className="text-2xl animate-bounce">💧</span>
          <span className="text-2xl animate-bounce delay-100">😭</span>
          <span className="text-2xl animate-bounce delay-200">💧</span>
        </div>
      )}

      {/* Speech bubble exclamation */}
      {isShocked && (
        <div className="absolute -top-12 -left-8 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
          WHAT THE--?! 😱
        </div>
      )}

      {/* Ayesha Portrait SVG */}
      <svg className="w-48 sm:w-56 h-64 drop-shadow-2xl" viewBox="0 0 200 240">
        <ellipse cx="100" cy="230" rx="60" ry="8" fill="#000" opacity="0.3" />

        {/* Maroon & Crimson University Kurti / Blazer */}
        <path d="M40,240 C40,185 70,165 100,165 C130,165 160,185 160,240 Z" fill="#991b1b" />
        <polygon points="100,165 90,195 100,225 110,195" fill="#fecdd3" />

        {/* Neck */}
        <rect x="88" y="138" width="24" height="30" rx="4" fill="#fed7aa" />

        {/* Head / Face */}
        <ellipse cx="100" cy="112" rx="40" ry="44" fill="#ffedd5" />
        {/* Ears */}
        <ellipse cx="59" cy="114" rx="5" ry="9" fill="#fed7aa" />
        <ellipse cx="141" cy="114" rx="5" ry="9" fill="#fed7aa" />

        {/* Dark Auburn Wavy Hair */}
        <path
          d="M50,110 C40,55 75,35 100,35 C125,35 160,55 150,110 C140,160 135,190 148,220 C135,200 130,150 135,110 C125,75 110,65 100,68 C90,65 75,75 65,110 C70,150 65,200 52,220 C65,190 60,160 50,110 Z"
          fill="#451a03"
        />

        {/* Eyes */}
        {isCrying ? (
          <>
            {/* Dramatic tear streams */}
            <path d="M78,106 Q72,118 70,135 Q74,138 78,135 Z" fill="#38bdf8" />
            <path d="M122,106 Q128,118 130,135 Q126,138 122,135 Z" fill="#38bdf8" />
            {/* Closed crying eye arcs */}
            <path d="M72,106 Q82,98 92,106" stroke="#451a03" strokeWidth="3" fill="none" />
            <path d="M108,106 Q118,98 128,106" stroke="#451a03" strokeWidth="3" fill="none" />
          </>
        ) : isShocked ? (
          <>
            {/* Huge shocked anime eyes */}
            <circle cx="82" cy="107" r="8" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
            <circle cx="82" cy="107" r="3" fill="#451a03" />
            <circle cx="118" cy="107" r="8" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
            <circle cx="118" cy="107" r="3" fill="#451a03" />
          </>
        ) : (
          <>
            {/* Intense / Demanding Eyes */}
            <ellipse cx="82" cy="106" rx="6" ry="7" fill="#451a03" />
            <circle cx="84" cy="104" r="2" fill="#ffffff" />
            <ellipse cx="118" cy="106" rx="6" ry="7" fill="#451a03" />
            <circle cx="120" cy="104" r="2" fill="#ffffff" />
          </>
        )}

        {/* Eyebrows */}
        {isCrying ? (
          <>
            <line x1="72" y1="94" x2="92" y2="99" stroke="#451a03" strokeWidth="2.5" />
            <line x1="108" y1="99" x2="128" y2="94" stroke="#451a03" strokeWidth="2.5" />
          </>
        ) : (
          <>
            <line x1="72" y1="99" x2="92" y2="95" stroke="#451a03" strokeWidth="2.5" />
            <line x1="108" y1="95" x2="128" y2="99" stroke="#451a03" strokeWidth="2.5" />
          </>
        )}

        {/* Cheeks / Blush */}
        <circle cx="70" cy="118" rx="6" ry="4" fill="#f43f5e" opacity="0.3" />
        <circle cx="130" cy="118" rx="6" ry="4" fill="#f43f5e" opacity="0.3" />

        {/* Mouth */}
        {isCrying ? (
          <path d="M92,138 Q100,128 108,138" stroke="#991b1b" strokeWidth="3" fill="none" />
        ) : isShocked ? (
          <ellipse cx="100" cy="138" rx="8" ry="12" fill="#881337" />
        ) : expression === "smile" ? (
          <path d="M92,132 Q100,140 108,132" stroke="#be123c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M90,134 L110,134" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}
