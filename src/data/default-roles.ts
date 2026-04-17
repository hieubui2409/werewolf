import { WOLF_ROLES } from "./roles/wolf-roles";
import { VILLAGER_ROLES } from "./roles/villager-roles";
import { THIRD_PARTY_ROLES } from "./roles/third-party-roles";
import type { RoleTemplate } from "../types/game";

export { WOLF_ROLES } from "./roles/wolf-roles";
export { VILLAGER_ROLES } from "./roles/villager-roles";
export { THIRD_PARTY_ROLES } from "./roles/third-party-roles";

export const DEFAULT_ROLES: RoleTemplate[] = [
  ...WOLF_ROLES,
  ...VILLAGER_ROLES,
  ...THIRD_PARTY_ROLES,
].map((r) => ({ ...r, version: r.version ?? 1 }));

export const INITIAL_ROLE_IDS = [
  "b_wolf",
  "b_seer",
  "b_guard",
  "b_witch",
  "b_hunter",
  "a_lycan",
  "a_traitor",
];

export const MAX_ABILITIES_PER_ROLE = 5;
