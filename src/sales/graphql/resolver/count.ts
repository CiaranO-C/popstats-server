import prisma from "../../../../config/prisma";
import { countSaleItemsByDate, countSales, countSalesByDate } from "../../db";

async function getSaleCount(parent, args, context) {
  const { userId } = context;
  const saleCount = await countSales({ userId });

  return saleCount;
}

function convertBigInts(
  dataArr: { [field: string]: Date | bigint }[],
  keysToIgnore: string[],
) {
  const countConverted = dataArr.map((row) => {
    const rowArr = Object.entries(row);
    const converted = rowArr.map(([key, value]) => {
      if (keysToIgnore.includes(key)) return [key, value];
      return [key, Number(value)];
    });

    return Object.fromEntries(converted);
  });
  return countConverted;
}

async function countByDate(parent, args, context) {
  const { userId } = context;

  const count = await countSalesByDate(userId);

  const converted = convertBigInts(count, ["date"]);
  return converted;
}

async function countSaleItems(parent, args, context) {
  const { userId } = context;
  const count = await countSaleItemsByDate(userId);

  const converted = convertBigInts(count, ["date"]);
  return converted;
}

export { getSaleCount, countByDate, countSaleItems };
