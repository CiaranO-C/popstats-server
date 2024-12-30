import { countSales } from "../../db";

async function getSaleCount(parent, args, context) {
  const { userId } = context;
  const saleCount = await countSales({ userId });

  return saleCount;
}

export { getSaleCount };
