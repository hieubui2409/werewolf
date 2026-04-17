import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "../bottom-sheet";

// Mock react-i18next to avoid initialization issues
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "vi", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

describe("BottomSheet", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders children when isOpen is true", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div data-testid="sheet-content">Test Content</div>
      </BottomSheet>,
    );

    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("returns null when isOpen is false", () => {
    const { container } = render(
      <BottomSheet isOpen={false} onClose={mockOnClose}>
        <div>Hidden Content</div>
      </BottomSheet>,
    );

    expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it("triggers exit animation on overlay click, calls onClose on animation end", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </BottomSheet>,
    );

    const overlay = container.querySelector("div[aria-hidden='true']");
    if (overlay && overlay instanceof HTMLElement) {
      fireEvent.click(overlay);
    }

    const dialog = container.querySelector('[role="dialog"]')!;
    expect(dialog.className).toContain("sheet-exit");

    dialog.dispatchEvent(new Event("animationend", { bubbles: true }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("triggers exit animation on Escape, calls onClose on animation end", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <button>Focus me</button>
      </BottomSheet>,
    );

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    const dialog = container.querySelector('[role="dialog"]')!;
    expect(dialog.className).toContain("sheet-exit");

    dialog.dispatchEvent(new Event("animationend", { bubbles: true }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not close when clicking inside the sheet", async () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div data-testid="sheet-content">Content</div>
      </BottomSheet>,
    );

    const content = screen.getByTestId("sheet-content");
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("triggers exit animation on close button click, calls onClose on animation end", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </BottomSheet>,
    );

    const closeButton = screen.getByLabelText("common.close");
    fireEvent.click(closeButton);

    const dialog = container.querySelector('[role="dialog"]')!;
    expect(dialog.className).toContain("sheet-exit");

    dialog.dispatchEvent(new Event("animationend", { bubbles: true }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA attributes for dialog/modal", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BottomSheet>,
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "sheet-title");
  });

  it("renders title and icon when provided", () => {
    render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        icon={<span data-testid="test-icon">★</span>}
      >
        <div>Content</div>
      </BottomSheet>,
    );

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveAttribute("id", "sheet-title");
    expect(titleElement).toBeInTheDocument();

    const iconElement = screen.getByTestId("test-icon");
    expect(iconElement).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </BottomSheet>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("applies custom titleColor when provided", () => {
    render(
      <BottomSheet
        isOpen={true}
        onClose={mockOnClose}
        title="Colored Title"
        titleColor="text-red-500"
      >
        <div>Content</div>
      </BottomSheet>,
    );

    const titleElement = screen.getByText("Colored Title");
    expect(titleElement).toHaveClass("text-red-500");
  });

  it("applies fullHeight class when fullHeight is true", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} fullHeight={true}>
        <div>Content</div>
      </BottomSheet>,
    );

    const sheetContainer = container.querySelector('[role="dialog"]');
    expect(sheetContainer).toHaveClass("h-[90vh]");
  });

  it("applies max-h class when fullHeight is false", () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose} fullHeight={false}>
        <div>Content</div>
      </BottomSheet>,
    );

    const sheetContainer = container.querySelector('[role="dialog"]');
    expect(sheetContainer).toHaveClass("max-h-[85vh]");
  });
});
