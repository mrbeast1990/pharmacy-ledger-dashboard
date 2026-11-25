import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each(["/", "/settings", "/statement", "/invoices/new", "/invoices/invoice-1", "/payments/new", "/pharmacies/pharmacy-1"])(
    "places %s under the authenticated owner gate",
    (path) => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

      expect(router.matchRoutes(path).some((match) => match.routeId === "/_authenticated")).toBe(true);
    },
  );

  it("keeps /auth public", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes("/auth").some((match) => match.routeId === "/_authenticated")).toBe(false);
  });
});
