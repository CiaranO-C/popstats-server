import { convertBigInts } from "../../../utils/convert.js";
import { countSaleItemsByDate, countSales, countSalesByDate } from "../../db.js";

async function getSaleCount(parent, args, context) {
  const { userId } = context;
  const saleCount = await countSales({ userId });

  return saleCount;
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
