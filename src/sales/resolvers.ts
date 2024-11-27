import prisma from "../../config/prisma";

async function getTotalSales(parent, args, context) {
  const sales = await prisma.sale.count();

  return sales;
}

async function getAverageSaleValue(parent, args, context) {
  const average = await prisma.sale.aggregate({
    _avg: {
      total: true,
    },
  });
  const rounded = average._avg.total.toFixed(2);

  return rounded;
}

async function getMostPopularCategory(parent, args, context) {
  const [popular] = await prisma.item.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
    take: 1,
  });

  return popular.category;
}

export { getTotalSales, getAverageSaleValue, getMostPopularCategory };
