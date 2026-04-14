import { useEffect, useRef, type ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  titleColor?: string;
  fullHeight?: boolean;
  children: ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  icon,
  titleColor = "text-slate-900 dark:text-white",
  fullHeight = false,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus first element in sheet
    requestAnimationFrame(() => {
      const first = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85 flex flex-col justify-end backdrop-blur-sm md:items-center"
      onClick={onClose}
      aria-label="Close"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        className={`bg-white dark:bg-slate-900 rounded-t-[2rem] md:rounded-2xl p-5 border-t-2 border-gray-200 dark:border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] modal-enter flex flex-col w-full md:max-w-[640px] ${fullHeight ? "h-[90vh]" : "max-h-[85vh]"} md:mb-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 shrink-0">
          {title && (
            <h3
              id="sheet-title"
              className={`text-2xl font-black ${titleColor} uppercase tracking-wide`}
            >
              {icon && <i className={`fas ${icon} mr-3 opacity-80`} />}
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-700 transition"
            aria-label="Close"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
