// Web Audio API sound generator & PCM tools for Gemini Live API

let audioCtx: AudioContext | null = null;
let bgmOsc: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;
let currentBgmTrack: string | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound Effects Synthesizer
export function playSfx(type: "click" | "page" | "shock" | "crying" | "rainbow" | "sprint" | "chime") {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === "click" || type === "page") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "shock") {
      // Dramatic sub-bass hit + discordant tension
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      osc2.frequency.setValueAtTime(95, now);
      osc2.frequency.exponentialRampToValueAtTime(48, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
    } else if (type === "rainbow") {
      // Magical ascending chime arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } else if (type === "sprint") {
      // Fast cartoon running steps
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const f = i % 2 === 0 ? 320 : 380;
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0.18, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.07);
      }
    } else if (type === "chime") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn("Audio playback error:", e);
  }
}

// Background Music Synth Generator
let isBgmPlaying = false;
let bgmInterval: any = null;

export function playAmbientBgm(
  theme: "library" | "campus" | "dramatic" | "comedy" | "wind" = "library",
  enabled = true
) {
  if (!enabled) {
    stopAmbientBgm();
    return;
  }
  if (isBgmPlaying && currentBgmTrack === theme) return;
  stopAmbientBgm();
  currentBgmTrack = theme;
  isBgmPlaying = true;

  try {
    const ctx = getAudioContext();

    const playChord = () => {
      if (!isBgmPlaying) return;
      const now = ctx.currentTime;
      let chords: number[][] = [];

      if (theme === "library") {
        // Peaceful study chords in C major / A minor
        chords = [
          [261.63, 329.63, 392.0], // C
          [220.0, 261.63, 329.63], // Am
          [174.61, 220.0, 261.63], // F
          [196.0, 246.94, 293.66], // G
        ];
      } else if (theme === "dramatic") {
        // Tension chords for crying confession
        chords = [
          [220.0, 261.63, 311.13], // D dim / Am
          [185.0, 220.0, 277.18],
          [207.65, 261.63, 311.13],
        ];
      } else if (theme === "comedy") {
        // Upbeat cartoon sprint chords
        chords = [
          [349.23, 440.0, 523.25],
          [392.0, 493.88, 587.33],
          [440.0, 554.37, 659.25],
        ];
      } else {
        chords = [
          [261.63, 392.0, 523.25],
          [293.66, 369.99, 440.0],
        ];
      }

      const randomChord = chords[Math.floor(Math.random() * chords.length)];
      randomChord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = theme === "comedy" ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (theme === "comedy" ? 1.0 : 2.5));

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + (theme === "comedy" ? 1.1 : 2.6));
      });
    };

    playChord();
    bgmInterval = setInterval(playChord, theme === "comedy" ? 1200 : 2800);
  } catch (err) {
    console.warn("BGM initialization failed:", err);
  }
}

export function stopAmbientBgm() {
  isBgmPlaying = false;
  currentBgmTrack = null;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

// PCM helpers for Gemini Live API
// 1. Microphone capture: Float32Array to 16kHz 16-bit PCM little-endian Base64
export function pcmToBase64(float32Array: Float32Array): string {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 2. Playback: 24kHz PCM from base64 string
let outputAudioContext: AudioContext | null = null;
let nextPlayTime = 0;

export function getOutputAudioContext(): AudioContext {
  if (!outputAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
  }
  if (outputAudioContext.state === "suspended") {
    outputAudioContext.resume();
  }
  return outputAudioContext;
}

export function playLivePcmChunk(base64Audio: string) {
  try {
    const ctx = getOutputAudioContext();
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    if (nextPlayTime < now) {
      nextPlayTime = now;
    }
    source.start(nextPlayTime);
    nextPlayTime += audioBuffer.duration;
  } catch (err) {
    console.error("Failed to play PCM chunk:", err);
  }
}

export function resetLivePlayback() {
  if (outputAudioContext) {
    nextPlayTime = outputAudioContext.currentTime;
  }
}
