import type { ActionLog } from "../types/game";

export interface UndoEntry {
  type: "action_undo";
  actionId: string;
  executionId: string;
  removedActions: ActionLog[];
  usageDecrements: Record<number, Record<string, number>>;
}

const MAX_UNDO_HISTORY = 20;

export function pushUndo(stack: UndoEntry[], entry: UndoEntry): UndoEntry[] {
  return [...stack.slice(-(MAX_UNDO_HISTORY - 1)), entry];
}

export function popUndo(stack: UndoEntry[]): {
  entry: UndoEntry | undefined;
  remaining: UndoEntry[];
} {
  if (stack.length === 0) return { entry: undefined, remaining: stack };
  const entry = stack[stack.length - 1];
  return { entry, remaining: stack.slice(0, -1) };
}
