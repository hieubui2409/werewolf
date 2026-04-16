import type { Faction } from "../types/game";

export interface FactionStyle {
  border: string;
  borderSolid: string;
  bg: string;
  bgLight: string;
  text: string;
  textBright: string;
  badge: string;
  shadow: string;
  glow: string;
  gradient: string;
}

const FACTION_STYLES: Record<Faction | "dead", FactionStyle> = {
  villager: {
    border: "border-blue-400/30",
    borderSolid: "border-blue-400",
    bg: "bg-blue-600",
    bgLight: "bg-blue-500/10",
    text: "text-blue-400",
    textBright: "text-blue-300",
    badge: "bg-blue-600",
    shadow: "shadow-card",
    glow: "shadow-glow-villager",
    gradient: "linear-gradient(145deg, #1e3a5f, #161631)",
  },
  wolf: {
    border: "border-red-400/30",
    borderSolid: "border-red-400",
    bg: "bg-red-600",
    bgLight: "bg-red-500/10",
    text: "text-red-400",
    textBright: "text-red-300",
    badge: "bg-red-600",
    shadow: "shadow-card",
    glow: "shadow-glow-wolf",
    gradient: "linear-gradient(145deg, #5f1e1e, #161631)",
  },
  third: {
    border: "border-purple-400/30",
    borderSolid: "border-purple-400",
    bg: "bg-purple-600",
    bgLight: "bg-purple-500/10",
    text: "text-purple-400",
    textBright: "text-purple-300",
    badge: "bg-purple-600",
    shadow: "shadow-card",
    glow: "shadow-glow-third",
    gradient: "linear-gradient(145deg, #1e1b4b, #161631)",
  },
  dead: {
    border: "border-red-900/30",
    borderSolid: "border-red-900",
    bg: "bg-red-950",
    bgLight: "bg-red-950/10",
    text: "text-red-800",
    textBright: "text-red-700",
    badge: "bg-red-900",
    shadow: "shadow-none",
    glow: "shadow-none",
    gradient: "linear-gradient(145deg, #450a0a, #0f0f23)",
  },
};

export function getFactionStyle(faction: Faction | "dead"): FactionStyle {
  return FACTION_STYLES[faction] ?? FACTION_STYLES.villager;
}
