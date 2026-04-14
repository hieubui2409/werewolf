import type { TFunction } from "i18next";

/** Translate a name using its i18n key, with fallback to hardcoded name */
export function tr(t: TFunction, nameKey: string | undefined, name: string) {
  return nameKey ? t(nameKey, name) : name;
}
