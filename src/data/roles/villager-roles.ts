import type { RoleTemplate } from "../../types/game";
import { VILLAGER_BASIC_ROLES } from "./villager-basic-roles";
import { VILLAGER_ADVANCED_ROLES } from "./villager-advanced-roles";

export { VILLAGER_BASIC_ROLES } from "./villager-basic-roles";
export { VILLAGER_ADVANCED_ROLES } from "./villager-advanced-roles";

export const VILLAGER_ROLES: RoleTemplate[] = [
  ...VILLAGER_BASIC_ROLES,
  ...VILLAGER_ADVANCED_ROLES,
];
