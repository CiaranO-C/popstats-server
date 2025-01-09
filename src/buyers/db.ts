import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

async function countBuyers(args: Prisma.UserBuyerCountArgs) {
  const count = await prisma.userBuyer.count(args);

  return count;
}

async function findManyBuyers(args: Prisma.UserBuyerFindManyArgs) {
    const buyers = await prisma.userBuyer.findMany(args)

    return buyers
}

export { countBuyers, findManyBuyers };
