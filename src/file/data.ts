import { Prisma } from "@prisma/client";
import { CSVFile, CSVRow } from "./type";
import {
  checkFieldMap,
  generateSaleId,
  parseDateTime,
  parseMoney,
} from "./utils";

function prepareLocationData(row: CSVRow): Prisma.LocationCreateManyInput {
  return {
    country: checkFieldMap(row["Country"]),
  };
}

function prepareBuyerData(
  row: CSVRow,
  userId: number,
): Prisma.BuyerCreateManyInput {
  return {
    username: row["Buyer"],
    userId,
  };
}

function prepareBuyerLocations(
  row: CSVRow,
): Prisma.BuyerLocationCreateManyInput {
  return {
    username: row["Buyer"],
    country: checkFieldMap(row["Country"]),
  };
}

function prepareSaleData(
  row: CSVRow,
  userId: number,
): Prisma.SaleCreateManyInput {
  return {
    id: generateSaleId(row),
    dateOfSale: parseDateTime(row["Date of sale"], row["Time of sale"]),
    customShipPrice: parseMoney(row["Buyer shipping cost"]),
    uspsCost: parseMoney(row["USPS Cost"]),
    paymentFee: parseMoney(row["Depop Payments fee"]),
    paymentMethod: row["Payment type"],
    bundle: row["Bundle"] === "Yes",
    total: parseMoney(row["Total"]),
    refund: parseMoney(row["Refunded to buyer amount"]),
    feeRefund: parseMoney(row["Fees refunded to seller"]),
    buyerId: row["Buyer"],
    userId,
  };
}

function prepareItemData(
  row: CSVRow,
  userId: number,
): Prisma.ItemCreateManyInput {
  return {
    dateOfListing: parseDateTime(row["Date of listing"]),
    price: parseMoney(row["Item price"]),
    brand: checkFieldMap(row["Brand"]),
    descLength: row["Description"].length,
    size: row["Size"] === "" ? "Other" : row["Size"],
    category: row["Category"],
    itemFee: parseMoney(row["Depop fee"]),
    boostFee: parseMoney(row["Boosting fee"]),
    saleId: generateSaleId(row),
    userId,
  };
}

function prepareData(data: CSVFile, userId: number) {
  const locations: Prisma.LocationCreateManyInput[] = [];
  const buyers: Prisma.BuyerCreateManyInput[] = [];
  const buyerLocations: Prisma.BuyerLocationCreateManyInput[] = [];
  const sales: Prisma.SaleCreateManyInput[] = [];
  const items: Prisma.ItemCreateManyInput[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    locations.push(prepareLocationData(row));
    buyers.push(prepareBuyerData(row, userId));
    buyerLocations.push(prepareBuyerLocations(row));
    sales.push(prepareSaleData(row, userId));
    items.push(prepareItemData(row, userId));
  }
  return { locations, buyers, buyerLocations, sales, items };
}

export { prepareData };
