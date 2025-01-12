import { Prisma } from "@prisma/client";
import { UserRole, UserType } from "./type.js";

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
