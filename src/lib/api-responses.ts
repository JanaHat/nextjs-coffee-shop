import { NextResponse } from "next/server";

type ApiErrorExtra = Record<string, unknown>;
type ApiSuccessPayload = Record<string, unknown>;

export const apiError = (status: number, message: string, extra: ApiErrorExtra = {}) => {
  return NextResponse.json(
    {
      ok: false,
      message,
      ...extra,
    },
    { status },
  );
};

export const apiSuccess = (payload: ApiSuccessPayload = {}, status = 200) => {
  return NextResponse.json(
    {
      ok: true,
      ...payload,
    },
    { status },
  );
};
