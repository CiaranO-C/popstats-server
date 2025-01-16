import { convertBigInts } from "../../../utils/convert.js";
import {
  countSaleItemsByDate,
  countSales,
  countSalesByDate,
} from "../../db.js";

async function getSaleCount(parent, args, context): Promise<number> {
  if (parent.sales !== undefined) return parent.sales;

  const { userId } = context;
  const saleCount = await countSales({ userId });

  return saleCount;
}

async function getRefundCount(parent, args, context): Promise<number> {
  if (parent.refunds !== undefined) return parent.refunds;

  const { userId } = context;
  const refundCount = await countSales({ userId, refund: { gt: 0 } });
  console.log("REFUNDS! ", refundCount);
  return refundCount;
}

async function getBundlesCount(parent, args, context): Promise<number> {
  if (parent.bundles !== undefined) return parent.bundles;
  const { userId } = context;
  const bundleCount = await countSales({ userId, bundle: { equals: true } });
  console.log("Bundles! ", bundleCount);
  return bundleCount;
}

async function countByDate(parent, args, context) {
  const { userId } = context;

  const count = await countSalesByDate(userId);

  const converted = convertBigInts(count, ["date"]);
  console.log(converted);

  return converted;
}

async function countSaleItems(parent, args, context) {
  const { userId } = context;
  const count = await countSaleItemsByDate(userId);

  const converted = convertBigInts(count, ["date"]);
  return converted;
}

export { getSaleCount, countByDate, countSaleItems, getRefundCount, getBundlesCount };
