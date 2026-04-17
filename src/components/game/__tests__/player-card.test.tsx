import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerCard } from "../player-card";
import type { Player, GameRole, ActionLog } from "../../../types/game";

// Mock react-i18next to avoid initialization issues
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "vi", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

describe("PlayerCard", () => {
  const mockOnFlip = vi.fn();
  const mockOnSelect = vi.fn();
  const mockOnUndoAction = vi.fn();
  const mockOnUseSkill = vi.fn();

  const basePlayer: Player = {
    id: 1,
    name: "Alice",
    roleId: null,
    alive: true,
    abilityUsage: {},
  };

  const roleTemplate: GameRole = {
    id: "role_1",
    templateId: "t_wolf",
    name: "Sói",
    order: 1,
    faction: "wolf",
    abilities: [
      {
        id: "ab_1",
        name: "Cắn",
        type: "nightly",
        max: 0,
        targetCount: 1,
      },
    ],
  };

  beforeEach(() => {
    mockOnFlip.mockClear();
    mockOnSelect.mockClear();
    mockOnUndoAction.mockClear();
  });

  it("renders player name", () => {
    render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders 'Dân Làng' (villager) when no role assigned", () => {
    render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    expect(screen.getByText("Dân Làng")).toBeInTheDocument();
  });

  it("shows role name when role is assigned and flipped", () => {
    const playerWithRole: Player = { ...basePlayer, roleId: "role_1" };

    render(
      <PlayerCard
        player={playerWithRole}
        displayNumber={1}
        role={roleTemplate}
        actions={[]}
        isFlipped={true}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    expect(screen.getByText("Sói")).toBeInTheDocument();
  });

  it("toggles flip state when card clicked", () => {
    const { container } = render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const flipContainer = container.querySelector(".flip-container");
    if (flipContainer) {
      fireEvent.click(flipContainer);
    }

    expect(mockOnFlip).toHaveBeenCalledWith(1);
  });

  it("adds flipped class when isFlipped is true", () => {
    const { container } = render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={true}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const flipContainer = container.querySelector(".flip-container");
    expect(flipContainer).toHaveClass("flipped");
  });

  it("shows dead state with line-through when player not alive", () => {
    const deadPlayer: Player = { ...basePlayer, alive: false };

    render(
      <PlayerCard
        player={deadPlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const nameElement = screen.getByText("Alice");
    expect(nameElement).toHaveClass("line-through");
    expect(nameElement).toHaveClass("opacity-60");
  });

  it("does not show line-through when player is alive", () => {
    const alivePlayer: Player = { ...basePlayer, alive: true };

    render(
      <PlayerCard
        player={alivePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const nameElement = screen.getByText("Alice");
    expect(nameElement).not.toHaveClass("line-through");
  });

  it("shows 'both' mode: renders name and role without flip", () => {
    const playerWithRole: Player = { ...basePlayer, roleId: "role_1" };

    render(
      <PlayerCard
        player={playerWithRole}
        displayNumber={1}
        role={roleTemplate}
        actions={[]}
        isFlipped={false}
        viewMode="both"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // In "both" mode, both name and role should be visible
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText(/Sói/)).toBeInTheDocument();
  });

  it("does not apply flipped class in 'both' mode", () => {
    const playerWithRole: Player = { ...basePlayer, roleId: "role_1" };
    const { container } = render(
      <PlayerCard
        player={playerWithRole}
        displayNumber={1}
        role={roleTemplate}
        actions={[]}
        isFlipped={true}
        viewMode="both"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // In "both" mode, there's a different render structure (no flip-container)
    const flipContainer = container.querySelector(".flip-container");
    expect(flipContainer).not.toBeInTheDocument();
  });

  it("calls onSelect when options button is clicked", () => {
    render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const optionsButtons = screen.getAllByLabelText("common.playerOptions");
    fireEvent.click(optionsButtons[0]);

    expect(mockOnSelect).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it("displays player ID in a badge", () => {
    const player: Player = { ...basePlayer, id: 5 };

    const { container } = render(
      <PlayerCard
        player={player}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // There are two player ID badges (front and back), just check that one exists
    const badges = container.querySelectorAll("span");
    const idBadge = Array.from(badges).find((el) => el.textContent === "5");
    expect(idBadge).toBeInTheDocument();
  });

  it("shows abilities for non-villager roles", () => {
    const playerWithRole: Player = { ...basePlayer, roleId: "role_1" };

    render(
      <PlayerCard
        player={playerWithRole}
        displayNumber={1}
        role={roleTemplate}
        actions={[]}
        isFlipped={true}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    expect(screen.getByText("Cắn")).toBeInTheDocument();
  });

  it("shows 'Không kỹ năng' for villager roles", () => {
    const villagerRole: GameRole = {
      id: "role_villager",
      templateId: "t_villager",
      name: "Dân Làng",
      order: 1,
      faction: "villager",
      abilities: [],
    };
    // When roleId is null, isVillager is true
    const playerWithoutRole: Player = { ...basePlayer, roleId: null };

    const { container } = render(
      <PlayerCard
        player={playerWithoutRole}
        displayNumber={1}
        role={villagerRole}
        actions={[]}
        isFlipped={true}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // When isVillager is true and role has no abilities, show "Không kỹ năng"
    const flipBack = container.querySelector(".flip-back");
    // The text may be nested, so check if "kỹ" appears anywhere in the element
    expect(flipBack?.innerHTML).toContain("kỹ");
  });

  it("displays action chips when actions exist", () => {
    const actions: ActionLog[] = [
      {
        id: "action_1",
        executionId: "exec_1",
        turnAdded: 1,
        sourceId: 1,
        targetId: 2,
        abilityId: "ab_1",
        abilityName: "Cắn",
        abilityType: "nightly",
        faction: "wolf",
        timestamp: Date.now(),
      },
    ];

    render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={actions}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // Check for the action chip button with aria-label containing the ability name
    const undoButtons = screen.getAllByLabelText("Hoàn tác Cắn");
    expect(undoButtons.length).toBeGreaterThan(0);
  });

  it("calls onUndoAction when action chip is clicked", () => {
    const actions: ActionLog[] = [
      {
        id: "action_1",
        executionId: "exec_1",
        turnAdded: 1,
        sourceId: 1,
        targetId: 2,
        abilityId: "ab_1",
        abilityName: "Cắn",
        abilityType: "nightly",
        faction: "wolf",
        timestamp: Date.now(),
      },
    ];

    render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={actions}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const undoButtons = screen.getAllByLabelText("Hoàn tác Cắn");
    fireEvent.click(undoButtons[0]);

    expect(mockOnUndoAction).toHaveBeenCalledWith(
      "action_1",
      expect.any(Object),
    );
  });

  it("shows faction-colored border based on role", () => {
    const playerWithRole: Player = { ...basePlayer, roleId: "role_1" };
    const { container } = render(
      <PlayerCard
        player={playerWithRole}
        displayNumber={1}
        role={roleTemplate}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    // Check that the card has the wolf faction border class
    const faceElement = container.querySelector(".flip-face");
    expect(faceElement).toHaveClass("border-red-400/30");
  });

  it("toggles flip state with Enter key", () => {
    const { container } = render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const flipContainer = container.querySelector(".flip-container");
    if (flipContainer) {
      fireEvent.keyDown(flipContainer, { key: "Enter" });
    }

    expect(mockOnFlip).toHaveBeenCalledWith(1);
  });

  it("toggles flip state with Space key", () => {
    const { container } = render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const flipContainer = container.querySelector(".flip-container");
    if (flipContainer) {
      fireEvent.keyDown(flipContainer, { key: " " });
    }

    expect(mockOnFlip).toHaveBeenCalledWith(1);
  });

  it("has correct ARIA attributes for accessibility", () => {
    const { container } = render(
      <PlayerCard
        player={basePlayer}
        displayNumber={1}
        role={undefined}
        actions={[]}
        isFlipped={false}
        viewMode="nameFirst"
        onFlip={mockOnFlip}
        onSelect={mockOnSelect}
        onUndoAction={mockOnUndoAction}
        onUseSkill={mockOnUseSkill}
      />,
    );

    const flipContainer = container.querySelector(".flip-container");
    expect(flipContainer).toHaveAttribute("role", "button");
    expect(flipContainer).toHaveAttribute("aria-label", "Alice - Dân Làng");
    expect(flipContainer).toHaveAttribute("aria-expanded", "false");
    expect(flipContainer).toHaveAttribute("tabindex", "0");
  });
});
