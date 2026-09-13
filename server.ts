import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, GenerateVideosOperation, Modality, LiveServerMessage } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
const server = http.createServer(app);
const PORT = 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check & configuration status
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    defaultModel: "veo-3.1-fast-generate-preview",
    liveModel: "gemini-3.1-flash-live-preview",
  });
});

// 2. Veo 3 Video Generation: Start operation
app.post("/api/generate-video", async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = "16:9",
      resolution = "720p",
      model = "veo-3.1-fast-generate-preview",
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAiClient();
    console.log(`Starting Veo video generation with model ${model}, ratio: ${aspectRatio}...`);

    const operation = await ai.models.generateVideos({
      model: model || "veo-3.1-fast-generate-preview",
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: (resolution as "720p" | "1080p") || "720p",
        aspectRatio: (aspectRatio as "16:9" | "9:16") || "16:9",
      },
    });

    console.log("Veo operation created:", operation.name);
    res.json({
      operationName: operation.name,
      model,
      aspectRatio,
      prompt,
    });
  } catch (error: any) {
    console.error("Veo video generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to start video generation",
    });
  }
});

// 3. Veo 3 Video Status: Poll operation
app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "operationName is required" });
    }

    const ai = getAiClient();
    let op: any;
    try {
      op = new GenerateVideosOperation();
      op.name = operationName;
    } catch {
      op = { name: operationName };
    }

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const isDone = Boolean(updated.done);
    const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;

    res.json({
      done: isDone,
      error: updated.error || null,
      hasVideo: Boolean(videoUri),
      metadata: updated.metadata || null,
    });
  } catch (error: any) {
    console.error("Veo video status error:", error);
    res.status(500).json({
      error: error.message || "Failed to check video status",
    });
  }
});

// 4. Veo 3 Video Download & Stream
app.post("/api/video-download", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "operationName is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const ai = getAiClient();
    let op: any;
    try {
      op = new GenerateVideosOperation();
      op.name = operationName;
    } catch {
      op = { name: operationName };
    }

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: "Video URI not ready or not found" });
    }

    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to download video: ${videoRes.status} ${videoRes.statusText}`);
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="air-university-inciting-incident.mp4"'
    );

    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Video download error:", error);
    res.status(500).json({
      error: error.message || "Failed to download video",
    });
  }
});

// 5. In-character dialogue & story generator (Gemini 3.8 Flash)
app.post("/api/chat", async (req, res) => {
  try {
    const { character = "tariq", message, history = [] } = req.body;
    const ai = getAiClient();

    let systemInstruction = "";
    if (character === "tariq") {
      systemInstruction = `You are Tariq Ahmed, an introverted aerospace engineering freshman at Air University Islamabad. You have jet black hair, wire-frame glasses, and always carry a thick aerodynamics book. You just experienced the legendary "inciting incident": in the AU Central Library, a dramatic girl named Ayesha cornered you, asked if you are single, broke down crying, and swore she'd leave campus forever if you didn't say yes. You froze, kept looking at your book in total silence, then revealed a vibrant rainbow flag from your pages and sprinted across the campus plaza! You speak politely, shyly, thoughtfully, and with slight nervous energy. Keep answers under 3-4 sentences.`;
    } else if (character === "ayesha") {
      systemInstruction = `You are Ayesha Noor, a theatrical, emotional student at Air University Islamabad. You caused the campus sensation when you confronted Tariq in the quiet library, pleaded in tears for him to say yes to dating you or you'd leave campus forever. You were left gasping in disbelief when he silently waved a rainbow flag and ran like an Olympic sprinter! You are expressive, quick-witted, dramatic, but warm underneath. Keep answers under 3-4 sentences.`;
    } else {
      systemInstruction = `You are the Air University Islamabad Campus Ambassador. You welcome students to the PAF Complex campus in Sector E-9, Islamabad, beneath the picturesque Margalla Hills. You know all about the C-Block Avionics wind tunnel labs, the aeronautics flight simulators, the central library, the cafeteria chai, and campus culture. Informative, engaging, collegiate.`;
    }

    const contents: any[] = history.map((h: any) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    }));
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate dialogue",
    });
  }
});

// 6. WebSocket Server for Gemini Live API Voice Conversations (gemini-3.1-flash-live-preview)
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const url = request.url ? new URL(request.url, `http://${request.headers.host}`) : null;
  if (url && url.pathname === "/api/live-ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});

wss.on("connection", async (clientWs, request) => {
  console.log("Client connected to Gemini Live WebSocket");
  let liveSession: any = null;
  let isClosed = false;

  const url = new URL(request.url || "", `http://${request.headers.host}`);
  const character = url.searchParams.get("character") || "tariq";
  const voiceName = url.searchParams.get("voice") || "Zephyr";

  let charSystemInstruction = `You are Tariq, a shy aerospace student with black hair and glasses at Air University Islamabad. You're famous for the library incident where a girl asked if you're single, you stayed silent staring at your book, then showed a rainbow flag and ran away! Speak in a gentle, slightly bashful, collegiate tone. Keep speech concise and natural for real-time voice chat.`;
  if (character === "ayesha") {
    charSystemInstruction = `You are Ayesha, a dramatic, lively Air University Islamabad student who initiated the viral library confession. Speak with vibrant, expressive, emotive inflections. Concise for voice chat.`;
  } else if (character === "guide") {
    charSystemInstruction = `You are the Air University Islamabad campus guide in Sector E-9 near Margalla Hills. Speak clearly, warmly, and helpfully.`;
  }

  try {
    const ai = getAiClient();
    liveSession = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName as any,
            },
          },
        },
        systemInstruction: charSystemInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const outputText = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text)?.text;
          const interrupted = message.serverContent?.interrupted;

          clientWs.send(
            JSON.stringify({
              audio,
              outputText,
              interrupted: Boolean(interrupted),
            })
          );
        },
        onclose: () => {
          if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ status: "session_closed" }));
          }
        },
        onerror: (err: any) => {
          console.error("Live API session error:", err);
          if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err?.message || "Live API session encountered an error" }));
          }
        },
      },
    });

    clientWs.send(
      JSON.stringify({
        status: "connected",
        character,
        voice: voiceName,
        message: `Connected to Live Voice API as ${character}`,
      })
    );

    clientWs.on("message", (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: payload.audio,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } else if (payload.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (err) {
        console.error("Error sending input to Live API session:", err);
      }
    });

    clientWs.on("close", () => {
      isClosed = true;
      if (liveSession && typeof liveSession.close === "function") {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
      }
    });
  } catch (err: any) {
    console.error("Live API connection setup error:", err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          error: err.message || "Failed to connect to Live API session",
        })
      );
      clientWs.close();
    }
  }
});

// Vite middleware for development or static serving for production
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Air University Visual Novel Server running on http://localhost:${PORT}`);
  });
}

startServer();
