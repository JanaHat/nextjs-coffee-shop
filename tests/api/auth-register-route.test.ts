import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    findUnique: vi.fn(),
    create: vi.fn(),
    hash: vi.fn(),
  };
});

vi.mock("@/src/lib/db", () => ({
  db: {
    user: {
      findUnique: mocks.findUnique,
      create: mocks.create,
    },
  },
}));

vi.mock("bcryptjs", () => ({
  hash: mocks.hash,
}));

import { POST } from "@/app/api/auth/register/route";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.hash.mockResolvedValue("hashed-password");
  });

  it("returns 400 for invalid JSON payload", async () => {
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, message: "Invalid JSON payload" });
  });

  it("returns 400 for invalid registration data", async () => {
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", email: "not-an-email", password: "123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, message: "Invalid registration data" });
  });

  it("returns 409 when email already exists", async () => {
    mocks.findUnique.mockResolvedValue({ id: "user-1" });

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jana Hatasova",
        email: "jana@example.com",
        password: "supersecret",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ ok: false, message: "Email is already registered" });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("creates user and returns 201 for valid payload", async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.create.mockResolvedValue({ id: "user-123" });

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jana Hatasova",
        email: "JANA@EXAMPLE.COM",
        password: "supersecret",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ ok: true });
    expect(mocks.hash).toHaveBeenCalledWith("supersecret", 12);
    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { email: "jana@example.com" },
      select: { id: true },
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        name: "Jana Hatasova",
        email: "jana@example.com",
        passwordHash: "hashed-password",
      },
      select: { id: true },
    });
  });
});
