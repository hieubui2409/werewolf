import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Moon } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";

export function PwaUpdateSheet() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("sw-update-available", handler);
    return () => window.removeEventListener("sw-update-available", handler);
  }, []);

  const handleUpdate = () => {
    (
      window as unknown as { __updateSW?: (reload: boolean) => void }
    ).__updateSW?.(true);
    setShow(false);
  };

  if (!show) return null;

  return (
    <BottomSheet
      isOpen={show}
      onClose={() => setShow(false)}
      title={t("pwa.newMoon", "Trăng mới mọc...")}
      icon={<Moon size={20} className="text-indigo-400" />}
      titleColor="text-indigo-300"
    >
      <div className="text-center py-6">
        <Moon size={48} className="text-indigo-400 mx-auto mb-4 moon-glow" />
        <p className="text-text-secondary text-sm font-bold mb-8">
          {t("pwa.updateAvailable", "Bản cập nhật mới đã sẵn sàng!")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShow(false)}
            className="flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95"
          >
            {t("pwa.later", "Để sau")}
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg transition active:scale-95 uppercase tracking-wide"
          >
            {t("pwa.updateNow", "Cập nhật ngay")}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
