import { countBuyers, findManyBuyers } from "../../db";

async function countAllBuyers(parent, args, context) {
  const { userId } = context;
  const count = await countBuyers({ where: { userId } });
  return count;
}

async function getAllBuyersList(parent, args, context) {
  const { userId } = context;
  const buyers = await findManyBuyers({
    where: { userId },
    select: {
      buyerId: true,
    },
  });

  return buyers.map(({ buyerId }) => buyerId);
}

export { countAllBuyers, getAllBuyersList };
