import prisma from "../../config/prisma";

async function findUsername(username = "") {
  const user = await prisma.user.findUnique({ where: { username } });
  return user;
}

export { findUsername };
