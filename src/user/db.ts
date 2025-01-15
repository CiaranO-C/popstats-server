import { $Enums, Prisma } from "@prisma/client";
import { UserType } from "./type.js";
import * as crypto from "crypto";
import prisma from "../../config/prisma.js";

async function createUser(
  tx: Prisma.TransactionClient,
  username: string = `user${crypto.randomUUID()}`,
  password: string = crypto.randomUUID(),
  role: $Enums.Role = "TEMPORARY",
): Promise<UserType> {
  const user = await tx.user.create({
    data: {
      id: crypto.randomUUID(),
      username,
      password,
      role,
    },
  });

  return user;
}

async function findUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  console.log(user);
  
  return user;
}

export { createUser, findUser };
