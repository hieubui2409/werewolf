import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  titleColor?: string;
  showDragHandle?: boolean;
  fullHeight?: boolean;
  children: ReactNode;
}

const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export function BottomSheet({
  isOpen,
  onClose,
  title,
  icon,
  titleColor = "text-text-primary",
  fullHeight = false,
  showDragHandle = true,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Swipe-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef<{
    y: number;
    time: number;
    onHandle: boolean;
  } | null>(null);
  const canSwipe = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    canSwipe.current = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
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

    const handleAnimationEnd = () => {
      canSwipe.current = true;
    };

    const sheet = sheetRef.current;
    sheet?.addEventListener("animationend", handleAnimationEnd);
    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      if (!sheetRef.current) return;
      const first = sheetRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (first) {
        first.focus();
      } else {
        requestAnimationFrame(() => {
          sheetRef.current
            ?.querySelector<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            ?.focus();
        });
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      sheet?.removeEventListener("animationend", handleAnimationEnd);
      previousFocus.current?.focus();
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canSwipe.current) return;
    const target = e.target as HTMLElement;
    const onHandle = target.closest("[data-drag-handle]") !== null;
    const contentEl = sheetRef.current?.querySelector("[data-sheet-content]");
    const atScrollTop = !contentEl || contentEl.scrollTop === 0;

    if (!onHandle && !atScrollTop) return;

    touchStart.current = {
      y: e.touches[0].clientY,
      time: Date.now(),
      onHandle,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (dy > 0) {
      setDragY(dy);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !isDragging) {
      touchStart.current = null;
      return;
    }
    const elapsed = Date.now() - touchStart.current.time;
    const velocity = dragY / elapsed;

    if (dragY > DISMISS_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      onCloseRef.current();
    }

    setDragY(0);
    setIsDragging(false);
    touchStart.current = null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85 flex flex-col justify-end backdrop-blur-sm md:items-center"
      onClick={() => onCloseRef.current()}
      aria-hidden="true"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sheet-title" : undefined}
        className={`bg-bg-surface rounded-t-[2rem] md:rounded-2xl p-5 border-t border-border-default shadow-sheet modal-enter flex flex-col w-full md:max-w-[640px] ${fullHeight ? "h-[90vh]" : "max-h-[85vh]"} md:mb-8 ${isDragging ? "sheet-dragging" : ""}`}
        style={isDragging ? { transform: `translateY(${dragY}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {showDragHandle && (
          <div
            data-drag-handle
            className="w-10 h-1 bg-bg-overlay rounded-full mx-auto mb-4 shrink-0 cursor-grab"
          />
        )}
        <div className="flex justify-between items-center mb-5 shrink-0">
          {title && (
            <h3
              id="sheet-title"
              className={`text-2xl font-black ${titleColor} uppercase tracking-wide`}
            >
              {icon && (
                <span className="mr-3 opacity-80 inline-flex">{icon}</span>
              )}
              {title}
            </h3>
          )}
          <button
            onClick={() => onCloseRef.current()}
            className="w-10 h-10 rounded-full bg-bg-elevated text-text-muted flex items-center justify-center hover:bg-bg-overlay transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div
          data-sheet-content
          className="flex-1 overflow-y-auto hide-scrollbar flex flex-col"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
