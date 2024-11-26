import { UserType } from "../user/type";
import { createTemporaryUser } from "../user/db";
import { CSVFile } from "./type";
import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { prepareData } from "./data";

async function createLocations(locations: Prisma.LocationCreateManyInput[]) {
  try {
    await prisma.location.createMany({
      data: locations,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating locations", error);
  }
}

async function createBuyers(buyers: Prisma.BuyerCreateManyInput[]) {
  try {
    await prisma.buyer.createMany({
      data: buyers,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating buyers", error);
  }
}

async function createBuyerLocations(
  relations: Prisma.BuyerLocationCreateManyInput[],
) {
  try {
    await prisma.buyerLocation.createMany({
      data: relations,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating buyerLocations", error);
  }
}

async function createSales(sales: Prisma.SaleCreateManyInput[]) {
  try {
    await prisma.sale.createMany({
      data: sales,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating sales", error);
  }
}

async function createItems(items: Prisma.ItemCreateManyInput[]) {
  try {
    await prisma.item.createMany({
      data: items,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating items", error);
  }
}

async function createSalesData(user: UserType | null, data: CSVFile) {
  if (user === null) user = await createTemporaryUser();
  const { id: userId } = user;
  const { locations, buyers, buyerLocations, sales, items } = prepareData(
    data,
    userId,
  );

  await createLocations(locations);
  await createBuyers(buyers);
  await createBuyerLocations(buyerLocations);
  await createSales(sales);
  await createItems(items);
}

export { createSalesData };
