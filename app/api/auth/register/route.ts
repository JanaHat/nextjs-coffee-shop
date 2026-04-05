import { hash } from "bcryptjs";
import { z } from "zod";

import { apiError, apiSuccess } from "@/src/lib/api-responses";
import { db } from "@/src/lib/db";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return apiError(400, "Invalid JSON payload");
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "Invalid registration data");
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const passwordHash = await hash(parsed.data.password, 12);

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return apiError(409, "Email is already registered");
  }

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: { id: true },
  });

  return apiSuccess({}, 201);
}
