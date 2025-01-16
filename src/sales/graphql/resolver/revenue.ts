import { Prisma } from "@prisma/client";
import prisma from "../../../../config/prisma.js";
import { aggregateSales, calcTotalNetRevenue, groupSales } from "../../db.js";
import { groupDateAverage } from "../../utils.js";

async function revenueByDate(parent, args, context) {
  const { userId }: { userId: string } = context;

  const res = await prisma.sale.findMany({
    where: { userId },
    select: {
      dateOfSale: true,
      total: true,
      paymentFee: true,
      refund: true,
      feeRefund: true,
      customShipPrice: true,
      items: { select: { itemFee: true, boostFee: true } },
    },
  });

  const mappedSales = res.map(({ dateOfSale, items, ...rest }) => {
    const saleData = Object.entries(rest).map(([key, value]) => [
      key,
      parseDecimal(value),
    ]);
    const itemFees = [
      "itemFees",
      items.reduce(
        (total, { itemFee, boostFee }) =>
          (total += parseDecimal(itemFee) + parseDecimal(boostFee)),
        0,
      ),
    ];
    saleData.push(itemFees);
    return { dateOfSale, ...Object.fromEntries(saleData) };
  });

  function parseDecimal(decimal: Prisma.Decimal | null): number {
    if (decimal === null) return 0;

    return parseFloat(`${decimal}`);
  }

  function groupRevenue(saleArr) {
    const grouped = {};
    saleArr.forEach((sale) => {
      const date = sale.dateOfSale;
      const keyExists = grouped[date];

      const {
        total,
        paymentFee,
        refund,
        feeRefund,
        itemFees,
        customShipPrice,
      } = sale;
      const net = parseFloat(
        (total + feeRefund - (paymentFee + refund + itemFees)).toFixed(2),
      );

      if (keyExists) {
        grouped[date].total = parseFloat(
          (grouped[date].total + total).toFixed(2),
        );
        grouped[date].net = parseFloat((grouped[date].net + net).toFixed(2));
        grouped[date].shipping = parseFloat(
          (grouped[date].shipping + customShipPrice).toFixed(2),
        );
      } else {
        grouped[date] = {
          total,
          net,
          date,
          shipping: customShipPrice,
        };
      }
    });
    return Object.values(grouped);
  }
  const grouped = groupRevenue(mappedSales);
  console.log(grouped);

  return grouped;
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

async function sumNetRevenue(parent, args, context) {
  const { userId }: { userId: string } = context;
  const net = await calcTotalNetRevenue(userId);

  return net;
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

export {
  revenueByDate,
  sumRevenue,
  sumNetRevenue,
  avgRevenueByDate,
  avgRevenueByHour,
};
