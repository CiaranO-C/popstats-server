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

async function getAverageSaleByDate(parent, args, context) {
  const { userId }: { userId: string } = context;
  const dailyGroup = await groupSales({
    by: ["dateOfSale"],
    where: { userId },
    _avg: {
      total: true,
    },
    orderBy: { dateOfSale: "asc" },
  });
  const monthlyGroup = await groupSales({
    by: ["dateOfSale"],
    where: {
      userId,
    },
    orderBy: { dateOfSale: "asc" },
    _sum: {
      total: true,
    },
  });
  const monthly = calcMonthlyAverage(monthlyGroup);

  return {
    daily: dailyGroup.map(({ _avg, dateOfSale }) => {
      console.log(dateOfSale);
      
      return {
      average: _avg?.total?.toFixed(2),
      date: dateOfSale.toISOString(),
    }}),
    monthly,
  };
}

function groupMonths(data) {
  const groupedData = {};
  for (let i = 0; i < data.length; i++) {
    const { _sum, dateOfSale } = data[i];
    const total = parseFloat(_sum.total);
    const month = new Date(dateOfSale).getUTCMonth();
    if (groupedData.hasOwnProperty(month)) {
      groupedData[month].total += total;
      groupedData[month].length++;
      continue;
    }
    groupedData[month] = { total, length: 1 };
  }

  return groupedData;
}



function calcMonthlyAverage(data) {
  const monthlyData: { [field: string]: { total: number; length: number } } =
    groupMonths(data);
  const monthArr = Object.entries(monthlyData);
  const averageArr = monthArr.map((month) => {
    const average = month[1].total / month[1].length;
    return {
      average: average.toFixed(2),
      month: month[0],
    };
  });

  return averageArr;
}

export { getSaleCount, getSalesByDate, getTotalSales, getAverageSaleByDate };
