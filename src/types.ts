export type AspectRatio = "16:9" | "9:16";

export type CharacterId = "tariq" | "ayesha" | "narrator" | "bilal" | "guide";

export type TariqExpression = "studious" | "reading" | "stunned" | "silent" | "rainbow" | "running";
export type AyeshaExpression = "demanding" | "crying" | "shocked" | "smile";
export type BackgroundId = "library" | "avionics_lab" | "courtyard" | "cafeteria" | "jet_monument";

export interface DialogueChoice {
  text: string;
  nextSceneId: string;
  tag?: string;
  color?: string;
}

export interface StoryScene {
  id: string;
  chapter: number;
  title: string;
  background: BackgroundId;
  speaker: string;
  speakerId: CharacterId;
  text: string;
  tariqExpression?: TariqExpression;
  ayeshaExpression?: AyeshaExpression;
  isRainbowReveal?: boolean;
  isIncitingIncident?: boolean;
  choices?: DialogueChoice[];
  sfx?: string;
  nextSceneId?: string;
  ambientSound?: "library" | "campus" | "wind" | "dramatic" | "comedy";
}

export interface VideoJob {
  operationName: string;
  prompt: string;
  aspectRatio: AspectRatio;
  status: "pending" | "generating" | "completed" | "failed";
  progress?: number;
  videoUrl?: string;
  error?: string;
  createdAt: number;
}

export interface LiveVoiceMessage {
  id: string;
  sender: "user" | "character" | "system";
  text: string;
  timestamp: string;
}

export interface CampusFeature {
  id: string;
  name: string;
  urduName: string;
  category: "Academics" | "Research" | "Student Life" | "Monument";
  description: string;
  discoveryNote: string;
  iconName: string;
  imageTheme: string;
  tariqMemory: string;
}
