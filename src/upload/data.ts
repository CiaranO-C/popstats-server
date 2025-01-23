import { Prisma } from "@prisma/client";
import { CountryType, CSVFile, CSVRow } from "./type.js";
import {
  checkFieldMap,
  convertToHours,
  generateItemId,
  generateSaleId,
  parseDateTime,
  parseMoney,
} from "./utils.js";

function prepareLocationData(row: CSVRow): Prisma.LocationCreateManyInput {
  return {
    country: checkFieldMap(row["Country"]),
  };
}

function prepareBuyerData(row: CSVRow): Prisma.BuyerCreateManyInput {
  return {
    username: row["Buyer"],
  };
}

function prepareUserBuyers(
  row: CSVRow,
  userId: string,
  fileId: string,
): Prisma.UserBuyerCreateManyInput {
  return {
    userId,
    fileId,
    buyerId: row["Buyer"],
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
  country: CountryType,
  userId: string,
  fileId: string,
): Prisma.SaleCreateManyInput {
  return {
    id: generateSaleId(row),
    dateOfSale: parseDateTime(row["Date of sale"], country),
    timeOfSale: convertToHours(row["Time of sale"]),
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
    fileId,
  };
}

function prepareItemData(
  row: CSVRow,
  country: CountryType,
  userId: string,
  fileId: string,
): Prisma.ItemCreateManyInput {
  return {
    id: generateItemId(row),
    dateOfListing: parseDateTime(row["Date of listing"], country),
    price: parseMoney(row["Item price"]),
    brand: checkFieldMap(row["Brand"]),
    descLength: row["Description"].length,
    size: row["Size"] === "" ? "Other" : row["Size"],
    category: checkFieldMap(row["Category"]),
    itemFee: parseMoney(row["Depop fee"]),
    boostFee: parseMoney(row["Boosting fee"]),
    saleId: generateSaleId(row),
    userId,
    fileId,
  };
}

function prepareData(
  userId: string,
  data: CSVFile,
  country: CountryType,
  fileId: string,
) {
  const locations: Prisma.LocationCreateManyInput[] = [];
  const buyers: Prisma.BuyerCreateManyInput[] = [];
  const buyerLocations: Prisma.BuyerLocationCreateManyInput[] = [];
  const userBuyers: Prisma.UserBuyerCreateManyInput[] = [];
  const sales: Prisma.SaleCreateManyInput[] = [];
  const items: Prisma.ItemCreateManyInput[] = [];

  const monthRangePerFile = 3;
  const firstDate = parseDateTime(data[0]["Date of sale"], country);
  const endDate = new Date(firstDate);
  endDate.setMonth(firstDate.getMonth() + monthRangePerFile);
  console.log("first date -> ", firstDate);
  console.log("last date -> ", endDate);

  function validateDate(endDate: Date, rowDate: string): boolean {
    const rowDateObj = parseDateTime(rowDate, country);
    return endDate >= rowDateObj;
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    //if row date is greater than 3 months from start of data, break
    if (!validateDate(endDate, row["Date of sale"])) break;

    locations.push(prepareLocationData(row));
    buyers.push(prepareBuyerData(row));
    userBuyers.push(prepareUserBuyers(row, userId, fileId));
    buyerLocations.push(prepareBuyerLocations(row));
    sales.push(prepareSaleData(row, country, userId, fileId));
    items.push(prepareItemData(row, country, userId, fileId));
  }
  return { locations, buyers, userBuyers, buyerLocations, sales, items };
}

export { prepareData };
