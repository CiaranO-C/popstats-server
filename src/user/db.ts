import { Prisma } from "@prisma/client";
import { UserRole, UserType } from "./type.js";
import * as crypto from "crypto";

async function createUser(
  tx: Prisma.TransactionClient,
  role: UserRole = "TEMPORARY",
): Promise<UserType> {
  const { id, username } = await tx.user.create({
    data: {
      id: crypto.randomUUID(),
      username: `user${crypto.randomUUID()}`,
      password: crypto.randomUUID(),
      role,
    },
  });

  return { id, username };
}

export { createUser };
