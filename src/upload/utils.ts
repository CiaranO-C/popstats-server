import XXH from "xxhashjs";
import { UserType } from "../user/type";
import { Prisma } from "@prisma/client";
import { createBuyerLocations, createBuyers, createFileEntry, createItems, createLocations, createSales, createUserBuyers } from "./db";
import { prepareData } from "../file/data";


function hashFileData(fileData: string) {
  const hash = XXH.h32(fileData, 0xabcd).toString(16);
  return hash;
}

async function createSalesData(
    userId,
    fileData,
    tx: Prisma.TransactionClient,
  ) {     
    const { locations, buyers, userBuyers, buyerLocations, sales, items } =
      prepareData(fileData, userId);
  
    await createLocations(locations, tx);
    await createBuyers(buyers, tx);
    await createUserBuyers(userBuyers, tx);
    await createBuyerLocations(buyerLocations, tx);
    await createSales(sales, tx);
    await createItems(items, tx);
  
    return true;
  }

export { hashFileData, createSalesData }