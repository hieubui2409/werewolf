import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "../bottom-sheet";

// Mock react-i18next to avoid initialization issues
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "vi", changeLanguage: vi.fn() },
  }),
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

  it("calls onClose when overlay is clicked", async () => {
    const { container } = render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </BottomSheet>,
    );

    // Click the overlay background
    const overlay = container.querySelector("div[aria-label='Close']");
    if (overlay && overlay instanceof HTMLElement) {
      fireEvent.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <button>Focus me</button>
      </BottomSheet>,
    );

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

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

  it("calls onClose when close button is clicked", async () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </BottomSheet>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

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
        icon="fa-star"
      >
        <div>Content</div>
      </BottomSheet>,
    );

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveAttribute("id", "sheet-title");
    expect(titleElement).toBeInTheDocument();

    // Check that icon element is rendered with fa-star class
    const iconElement = titleElement.querySelector("i.fa-star");
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
