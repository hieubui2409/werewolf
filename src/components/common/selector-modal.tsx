import { useTranslation } from "react-i18next";
import { Hash, Users, List } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";

export interface SelectorConfig {
  type: "order" | "targetCount" | "max" | "skillType";
  roleId: string;
  abilityId: string | null;
  currentValue: number | string;
}

interface SelectorModalProps {
  selector: SelectorConfig;
  rolesCount: number;
  playerCount: number;
  onClose: () => void;
  onSelect: (value: number | string) => void;
}

export function SelectorModal({
  selector,
  rolesCount,
  playerCount,
  onClose,
  onSelect,
}: SelectorModalProps) {
  const { t } = useTranslation();

  let title = "";
  let icon: React.ReactNode = <Hash size={20} />;
  let options: { value: number | string; label: string }[] = [];

  switch (selector.type) {
    case "order":
      title = t("setup.nightOrder", "Thứ Tự Gọi Đêm");
      options = Array.from({ length: Math.max(rolesCount, 1) }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      }));
      break;
    case "targetCount":
      title = t("setup.targetCount", "Số Lượng Mục Tiêu");
      icon = <Users size={20} />;
      options = Array.from({ length: playerCount + 1 }, (_, i) => ({
        value: i,
        label: i === 0 ? t("setup.noTarget", "0") : String(i),
      }));
      break;
    case "max":
      title = t("setup.usageLimit", "Số Lần Dùng Kỹ Năng");
      options = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      }));
      break;
    case "skillType":
      title = t("setup.skillType", "Loại Kỹ Năng");
      icon = <List size={20} />;
      options = [
        { value: "nightly", label: t("setup.nightly", "Mỗi Đêm") },
        { value: "limited", label: t("setup.limited", "Giới Hạn") },
      ];
      break;
  }

  const isNumber = selector.type !== "skillType";

  return (
    <BottomSheet isOpen onClose={onClose} title={title} icon={icon}>
      <div
        role="radiogroup"
        aria-label={title}
        className={`grid ${isNumber ? "grid-cols-5" : "grid-cols-2"} gap-3 pb-2`}
      >
        {options.map((opt) => {
          const isActive = selector.currentValue === opt.value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(opt.value)}
              className={`py-4 rounded-xl font-bold ${isNumber ? "text-xl" : "text-sm"} transition-all transform active:scale-95 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border-2 border-indigo-400"
                  : "bg-bg-elevated text-text-secondary border-2 border-border-default"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
