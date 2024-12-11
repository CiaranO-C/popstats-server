import { Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";

async function countSales(condition: Prisma.SaleWhereInput): Promise<number> {
  const count = await prisma.sale.count({ where: condition });
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

export { countSales, groupSales, aggregateSales };
