import { describe, expect, it } from "vitest";
import { router } from "./router";

describe("router smoke test", () => {
  it("contains critical MVP routes", () => {
    const routes = router.routes;

    const root = routes.find((route) => route.children)?.children ?? [];
    const publicPaths = root.map((route) => route.path);
    const authPaths = routes.map((route) => route.path);

    expect(publicPaths).toContain("/");
    expect(publicPaths).toContain("/dashboard");
    expect(publicPaths).toContain("/debts");
    expect(authPaths).toContain("/login");
    expect(authPaths).toContain("/register");
  });
});
