import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

async function countBuyers(args: Prisma.UserBuyerCountArgs) {
  const count = await prisma.userBuyer.count(args);

  return count;
}

async function findManyBuyers(args: Prisma.UserBuyerFindManyArgs) {
  const buyers = await prisma.userBuyer.findMany(args);

  return buyers;
}

async function buyersByCountry(userId: string) {
  const buyers: { buyers: bigint; country: string }[] = await prisma.$queryRaw`
    SELECT
      COUNT(buyer_locations.username) AS buyers,
      country
    FROM user_buyers
    JOIN buyers
      ON user_buyers.buyer_id = buyers.username
    JOIN buyer_locations
      ON buyers.username = buyer_locations.username
    GROUP BY country, user_buyers.user_id
      HAVING user_buyers.user_id = ${userId};
    `;

  return buyers;
}

export { countBuyers, findManyBuyers, buyersByCountry };
