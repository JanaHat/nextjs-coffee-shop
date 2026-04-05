import { Prisma } from "@prisma/client";

import { db } from "@/src/lib/db";

let favouriteTableAvailableCache = false;

const FAVOURITE_TABLE_SCHEMA = "public";
const FAVOURITE_TABLE_NAME = "Favourite";

const isPrismaCode = (error: unknown, code: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === code;
  }

  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: string }).code === code;
};

export const isFavouriteTableAvailable = async () => {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  if (favouriteTableAvailableCache) {
    return true;
  }

  try {
    const result = await db.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = ${FAVOURITE_TABLE_SCHEMA}
          AND table_name = ${FAVOURITE_TABLE_NAME}
      ) AS exists
    `;

    favouriteTableAvailableCache = Boolean(result[0]?.exists);
  } catch {
    return false;
  }

  return favouriteTableAvailableCache;
};

type ListUserFavouriteProductIdsOptions = {
  limit?: number;
  productIds?: string[];
};

export const listUserFavouriteProductIds = async (
  userId: string,
  options: ListUserFavouriteProductIdsOptions = {},
) => {
  if (!(await isFavouriteTableAvailable())) {
    return [];
  }

  try {
    const favourites = await db.favourite.findMany({
      where: {
        userId,
        ...(options.productIds && options.productIds.length > 0
          ? {
            productId: {
              in: options.productIds,
            },
          }
          : {}),
      },
      select: {
        productId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(typeof options.limit === "number" ? { take: options.limit } : {}),
    });

    return favourites.map((favourite) => favourite.productId);
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return [];
    }

    throw error;
  }
};

export const isUserProductFavourited = async (userId: string, productId: string) => {
  if (!(await isFavouriteTableAvailable())) {
    return false;
  }

  try {
    const favourite = await db.favourite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(favourite);
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return false;
    }

    throw error;
  }
};

export const addUserFavourite = async (userId: string, productId: string) => {
  if (!(await isFavouriteTableAvailable())) {
    return "unavailable" as const;
  }

  try {
    await db.favourite.create({
      data: {
        userId,
        productId,
      },
    });

    return "created" as const;
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return "unavailable" as const;
    }

    if (isPrismaCode(error, "P2002")) {
      return "exists" as const;
    }

    throw error;
  }
};

export const removeUserFavourite = async (userId: string, productId: string) => {
  if (!(await isFavouriteTableAvailable())) {
    return "unavailable" as const;
  }

  try {
    await db.favourite.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return "removed" as const;
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return "unavailable" as const;
    }

    throw error;
  }
};
