import prisma from "../../config/prisma";
import { UserType } from "./type";

async function createTemporaryUser(): Promise<UserType> {
  const user = await prisma.user.create({
    data: {
      username: `user${crypto.randomUUID()}`,
      password: crypto.randomUUID(),
    },
  });

  return { id: user.id, username: user.username };
}

createTemporaryUser();

export { createTemporaryUser };
