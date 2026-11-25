import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/integrations/supabase/client";
import { checkOwnerAccess } from "@/lib/auth-access";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    rpc: vi.fn(),
  },
}));

const getUserMock = vi.mocked(supabase.auth.getUser);
const rpcMock = vi.mocked(supabase.rpc);

describe("Owner access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("treats a missing authenticated user as anonymous without checking ownership", async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null } as never);

    await expect(checkOwnerAccess()).resolves.toBe("anonymous");
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("allows a signed-in user only when is_owner returns true", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "owner" } }, error: null } as never);
    rpcMock.mockResolvedValue({ data: true, error: null } as never);

    await expect(checkOwnerAccess()).resolves.toBe("authorized");
    expect(rpcMock).toHaveBeenCalledWith("is_owner");
  });

  it("rejects a signed-in user who is absent from app_owner", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "other" } }, error: null } as never);
    rpcMock.mockResolvedValue({ data: false, error: null } as never);

    await expect(checkOwnerAccess()).resolves.toBe("unauthorized");
  });

  it("fails closed when the ownership check returns an error", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "owner" } }, error: null } as never);
    rpcMock.mockResolvedValue({ data: null, error: { message: "failed" } } as never);

    await expect(checkOwnerAccess()).resolves.toBe("unauthorized");
  });
});
