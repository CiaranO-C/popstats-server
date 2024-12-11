import prisma from "../../../config/prisma";
import { getDateRange } from "../files/db";
import { aggregateSales, countSales, groupSales } from "./db";

async function getSaleCount(parent, args, context) {
  const { userId } = context;
  const saleCount = await countSales({ userId });

  return saleCount;
}

async function getSalesByDate(parent, args, context) {
  const { userId }: { userId: string } = context;
  const res = await groupSales({
    by: ["dateOfSale"],
    where: {
      userId,
    },
    orderBy: { dateOfSale: "asc" },
    _sum: {
      total: true,
    },
  });
  const totals = res.map(({ _sum, dateOfSale }) => ({
    total: _sum?.total,
    date: dateOfSale,
  }));
  return totals;
}

async function getTotalSales(parent, args, context) {
  const { userId }: { userId: string } = context;
  const sales = await countSales({ userId });
  const { _sum } = await aggregateSales({
    where: {
      userId,
    },
    _sum: {
      total: true,
    },
  });
  return { sales, revenue: _sum?.total };
}

export { getSaleCount, getSalesByDate, getTotalSales };
