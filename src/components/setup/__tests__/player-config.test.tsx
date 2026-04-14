import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayerConfig } from "../player-config";
import { useGameStore } from "../../../store/game-store";

// Mock react-i18next to avoid initialization issues
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: "vi", changeLanguage: vi.fn() },
  }),
}));

describe("PlayerConfig", () => {
  beforeEach(() => {
    // Reset the store to a known state before each test
    useGameStore.setState({
      playerCount: 4,
      players: [
        {
          id: 1,
          name: "Player 1",
          roleId: null,
          alive: true,
          abilityUsage: {},
        },
        {
          id: 2,
          name: "Player 2",
          roleId: null,
          alive: true,
          abilityUsage: {},
        },
        {
          id: 3,
          name: "Player 3",
          roleId: null,
          alive: true,
          abilityUsage: {},
        },
        {
          id: 4,
          name: "Player 4",
          roleId: null,
          alive: true,
          abilityUsage: {},
        },
      ],
    });
  });

  it("renders player count slider", () => {
    render(<PlayerConfig />);

    const slider = screen.getByRole("slider", {
      name: /setup.playerCount/i,
    });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("min", "4");
    expect(slider).toHaveAttribute("max", "30");
  });

  it("displays current player count", () => {
    render(<PlayerConfig />);

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders correct number of name inputs based on playerCount", () => {
    render(<PlayerConfig />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
  });

  it("displays correct player names in inputs", () => {
    render(<PlayerConfig />);

    expect(screen.getByDisplayValue("Player 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Player 2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Player 3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Player 4")).toBeInTheDocument();
  });

  it("updates player name in store when input changes", async () => {
    const user = userEvent.setup();
    render(<PlayerConfig />);

    const input = screen.getByDisplayValue("Player 1");
    await user.clear(input);
    await user.type(input, "Alice");

    const state = useGameStore.getState();
    expect(state.players[0].name).toBe("Alice");
  });

  it("renders more inputs when player count increases", async () => {
    render(<PlayerConfig />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "6" } });

    // Wait a bit for state update
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(6);
  });

  it("updates player count in store when slider changes", async () => {
    render(<PlayerConfig />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "8" } });

    const state = useGameStore.getState();
    expect(state.playerCount).toBe(8);
  });

  it("has accessible labels for player name inputs", () => {
    render(<PlayerConfig />);

    // Check that each input has an aria-label
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, index) => {
      expect(input).toHaveAttribute(
        "aria-label",
        `setup.playerCount ${index + 1}`,
      );
    });
  });

  it("respects min and max values on slider", () => {
    render(<PlayerConfig />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "4");
    expect(slider).toHaveAttribute("max", "30");
  });

  it("renders slider with aria-valuetext attribute", () => {
    render(<PlayerConfig />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuetext");
  });

  it("allows typing in player name inputs", async () => {
    const user = userEvent.setup();
    render(<PlayerConfig />);

    const input = screen.getByDisplayValue("Player 1");
    await user.clear(input);
    await user.type(input, "Bob");

    expect(input).toHaveValue("Bob");
  });

  it("renders all players from store", () => {
    useGameStore.setState({
      playerCount: 5,
      players: [
        { id: 1, name: "Alice", roleId: null, alive: true, abilityUsage: {} },
        { id: 2, name: "Bob", roleId: null, alive: true, abilityUsage: {} },
        { id: 3, name: "Charlie", roleId: null, alive: true, abilityUsage: {} },
        { id: 4, name: "Diana", roleId: null, alive: true, abilityUsage: {} },
        { id: 5, name: "Eve", roleId: null, alive: true, abilityUsage: {} },
      ],
    });

    render(<PlayerConfig />);

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Charlie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Diana")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Eve")).toBeInTheDocument();
  });

  it("handles multiple player name changes", async () => {
    const user = userEvent.setup();
    render(<PlayerConfig />);

    const inputs = screen.getAllByRole("textbox");

    await user.clear(inputs[0]);
    await user.type(inputs[0], "NewName1");

    await user.clear(inputs[1]);
    await user.type(inputs[1], "NewName2");

    const state = useGameStore.getState();
    expect(state.players[0].name).toBe("NewName1");
    expect(state.players[1].name).toBe("NewName2");
  });

  it("maintains other player properties when changing names", async () => {
    const user = userEvent.setup();

    useGameStore.setState({
      playerCount: 3,
      players: [
        {
          id: 1,
          name: "Player 1",
          roleId: "role1",
          alive: true,
          abilityUsage: { ab1: 1 },
        },
        {
          id: 2,
          name: "Player 2",
          roleId: null,
          alive: false,
          abilityUsage: {},
        },
        {
          id: 3,
          name: "Player 3",
          roleId: null,
          alive: true,
          abilityUsage: {},
        },
      ],
    });

    render(<PlayerConfig />);

    const input = screen.getByDisplayValue("Player 1");
    await user.clear(input);
    await user.type(input, "Alice");

    const state = useGameStore.getState();
    expect(state.players[0].name).toBe("Alice");
    expect(state.players[0].roleId).toBe("role1");
    expect(state.players[0].abilityUsage).toEqual({ ab1: 1 });

    expect(state.players[1].alive).toBe(false);
  });

  it("renders in a styled container", () => {
    const { container } = render(<PlayerConfig />);

    const configContainer = container.querySelector(
      ".bg-gray-100.dark\\:bg-slate-800",
    );
    expect(configContainer).toBeInTheDocument();
  });

  it("displays player count label", () => {
    render(<PlayerConfig />);

    expect(screen.getByLabelText("setup.playerCount")).toBeInTheDocument();
  });

  it("grid layout displays inputs in 2 columns on mobile", () => {
    const { container } = render(<PlayerConfig />);

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
  });
});
