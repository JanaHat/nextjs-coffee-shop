import { describe, expect, it, vi } from "vitest";

const { handlerMock } = vi.hoisted(() => ({
  handlerMock: vi.fn(),
}));

vi.mock("@/src/lib/auth", () => ({
  authHandler: handlerMock,
}));

import { GET, POST } from "@/app/api/auth/[...nextauth]/route";

describe("/api/auth/[...nextauth] route exports", () => {
  it("re-exports auth handler for GET and POST", () => {
    expect(GET).toBe(handlerMock);
    expect(POST).toBe(handlerMock);
  });
});
