import { Prisma } from "@prisma/client";
import { UserType } from "./type";

async function createTemporaryUser(
  tx: Prisma.TransactionClient,
): Promise<UserType> {
  const { id, username } = await tx.user.create({
    data: {
      username: `user${crypto.randomUUID()}`,
      password: crypto.randomUUID(),
    },
  });

  return { id, username };
}

export { createTemporaryUser };
