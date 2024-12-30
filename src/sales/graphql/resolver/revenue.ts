import { aggregateSales, countSales, groupSales } from "../../db";
import { groupDateAverage } from "../../utils";

async function revenueByDate(parent, args, context) {
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

async function sumRevenue(parent, args, context) {
  const { userId }: { userId: string } = context;
  const { _sum } = await aggregateSales({
    where: {
      userId,
    },
    _sum: {
      total: true,
    },
  });
  return _sum?.total;
}

async function avgRevenueByHour(parent, args, context) {
  const { userId }: { userId: string } = context;
  const groupedSales = await groupSales({
    by: ["timeOfSale"],
    where: {
      userId,
    },
    _avg: {
      total: true,
    },
    orderBy: { timeOfSale: "asc" },
  });
  return groupedSales.map(({ _avg, timeOfSale }) => ({
    average: _avg?.total?.toFixed(2),
    hour: timeOfSale,
  }));
}

async function avgRevenueByDate(parent, args, context) {
  const { userId }: { userId: string } = context;
  const groupedSales = await groupSales({
    by: ["dateOfSale"],
    where: {
      userId,
    },
    orderBy: { dateOfSale: "asc" },
    _sum: {
      total: true,
    },
  });
  const monthly = groupDateAverage(groupedSales, "month");
  const daily = groupDateAverage(groupedSales, "day");

  return {
    daily,
    monthly,
  };
}

export { revenueByDate, sumRevenue, avgRevenueByDate, avgRevenueByHour };
