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
  gradient: string;
}

const FACTION_STYLES: Record<Faction | "dead", FactionStyle> = {
  villager: {
    border: "border-blue-500/50",
    borderSolid: "border-blue-500",
    bg: "bg-blue-600",
    bgLight: "bg-blue-900/20",
    text: "text-blue-400",
    textBright: "text-blue-300",
    badge: "bg-blue-700",
    shadow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    gradient: "linear-gradient(145deg, #1e3a5f, #1e293b)",
  },
  wolf: {
    border: "border-red-500/50",
    borderSolid: "border-red-500",
    bg: "bg-red-600",
    bgLight: "bg-red-900/20",
    text: "text-red-400",
    textBright: "text-red-300",
    badge: "bg-red-700",
    shadow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    gradient: "linear-gradient(145deg, #5f1e1e, #1e293b)",
  },
  third: {
    border: "border-purple-500/50",
    borderSolid: "border-purple-500",
    bg: "bg-purple-600",
    bgLight: "bg-purple-900/20",
    text: "text-purple-400",
    textBright: "text-purple-300",
    badge: "bg-purple-700",
    shadow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    gradient: "linear-gradient(145deg, #1e1b4b, #312e81)",
  },
  dead: {
    border: "border-red-900",
    borderSolid: "border-red-900",
    bg: "bg-red-950",
    bgLight: "bg-red-950/20",
    text: "text-red-800",
    textBright: "text-red-700",
    badge: "bg-red-900",
    shadow: "shadow-none",
    gradient: "linear-gradient(145deg, #450a0a, #1c1917)",
  },
};

export function getFactionStyle(faction: Faction | "dead"): FactionStyle {
  return FACTION_STYLES[faction] ?? FACTION_STYLES.villager;
}
