import { UserType } from "../user/type";
import { createTemporaryUser } from "../user/db";
import { CSVFile } from "./type";
import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { prepareData } from "./data";

async function createLocations(
  locations: Prisma.LocationCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.location.createMany({
    data: locations,
    skipDuplicates: true,
  });
}

async function createBuyers(
  buyers: Prisma.BuyerCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.buyer.createMany({
    data: buyers,
    skipDuplicates: true,
  });
}

async function createBuyerLocations(
  relations: Prisma.BuyerLocationCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.buyerLocation.createMany({
    data: relations,
    skipDuplicates: true,
  });
}

async function createSales(
  sales: Prisma.SaleCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.sale.createMany({
    data: sales,
    skipDuplicates: true,
  });
}

async function createItems(
  items: Prisma.ItemCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.item.createMany({
    data: items,
    skipDuplicates: true,
  });
}

async function createSalesData(
  user: UserType | null,
  data: CSVFile,
  tx: Prisma.TransactionClient,
) {
  if (user === null) user = await createTemporaryUser(tx);
  const { id: userId } = user;
  const { locations, buyers, buyerLocations, sales, items } = prepareData(
    data,
    userId,
  );

  await createLocations(locations, tx);
  await createBuyers(buyers, tx);
  await createBuyerLocations(buyerLocations, tx);
  await createSales(sales, tx);
  await createItems(items, tx);

  return true;
}

export { createSalesData };
