import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./features/auth/hooks/useSession", () => ({
  useSession: () => ({
    data: { name: "Nahuel" },
    error: null,
  }),
}));

describe("App smoke test", () => {
  it("renders welcome message", () => {
    render(<App />);

    expect(
      screen.getByText(/Hola Nahuel, bienvenido a la aplicación de gestión de deudas/i),
    ).toBeInTheDocument();
  });
});
