import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

async function countSales(condition: Prisma.SaleWhereInput): Promise<number> {
  const count = await prisma.sale.count({ where: condition });
  return count;
}

async function countSalesByDate(userId: string) {
  const count = await prisma.$queryRaw<
    { date: Date; sales: bigint; refunds: bigint; bundles: bigint }[]
  >`
  SELECT
    date_of_sale AS date,
    COUNT(*) AS sales,
    COUNT(CASE WHEN buyer_refund > 0 THEN 1 ELSE NULL END) AS refunds,
    COUNT(CASE WHEN bundle THEN 1 ELSE NULL END) AS bundles
  FROM sales
  WHERE user_id = ${userId}
  GROUP BY date_of_sale
  ORDER BY date_of_sale ASC;`;

  return count;
}

async function countSaleItemsByDate(userId: string) {
  const count = await prisma.$queryRaw<
    { date: Date; items: bigint; boosted: bigint }[]
  >`
  SELECT 
    date_of_sale AS date,
    COUNT(items) AS items,
    COUNT(CASE WHEN boosting_fee > 0 THEN 1 ELSE NULL END) AS boosted
  FROM sales
  LEFT JOIN items
  ON sales.id = sale_id
  WHERE sales.user_id = ${userId}
  GROUP BY date_of_sale
  ORDER BY date_of_sale ASC;`;

  return count;
}

async function groupSales(
  args: Prisma.SaleGroupByArgs & {
    orderBy: Prisma.SaleGroupByArgs["orderBy"];
  },
) {
  const grouped = await prisma.sale.groupBy(args);
  return grouped;
}

async function aggregateSales(args: Prisma.SaleAggregateArgs) {
  const res = await prisma.sale.aggregate(args);
  return res;
}

async function findSales(args: Prisma.SaleFindManyArgs) {
  const res = await prisma.sale.findMany(args);
  return res;
}

export {
  countSales,
  countSalesByDate,
  countSaleItemsByDate,
  groupSales,
  aggregateSales,
  findSales,
};
