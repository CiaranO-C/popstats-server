import XXH from "xxhashjs";
import { Prisma } from "@prisma/client";
import {
  createBuyerLocations,
  createBuyers,
  createItems,
  createLocations,
  createSales,
  createUserBuyers,
} from "./db.js";
import { prepareData } from "./data.js";
import { parse } from "@fast-csv/parse";
import { CSVFile, CSVRow, CountryType } from "./type.js";

function hashFileData(fileData: string): string {
  const hash = XXH.h32(fileData, 0xabcd).toString(16);
  return hash;
}

function generateIdHash(fields: string[], row: CSVRow): string {
  let toHash: string = "";
  fields.forEach((field) => (toHash += row[field]));
  const hash = XXH.h32(toHash, 0).toString(16);

  return hash;
}

async function createSalesData(
  userId: string,
  fileData: CSVFile,
  fileId: string,
  country: CountryType,
  tx: Prisma.TransactionClient,
) {
  const { locations, buyers, userBuyers, buyerLocations, sales, items } =
    prepareData(userId, fileData, country, fileId);

  await createLocations(locations, tx);
  await createBuyers(buyers, tx);
  await createUserBuyers(userBuyers, tx);
  await createBuyerLocations(buyerLocations, tx);
  await createSales(sales, tx);
  await createItems(items, tx);

  return true;
}

async function csvToJson(fileString: string): Promise<CSVFile> {
  const rows: CSVFile = [];

  await new Promise<void>((resolve, reject) => {
    const stream = parse({ headers: true })
      .on("error", (error) => reject(error))
      .on("data", (row: CSVRow) => rows.push(row))
      .on("end", (rowCount: number) => {
        console.log(`${rowCount} rows parsed`);
        resolve();
      });
    stream.write(fileString);
    stream.end();
  });

  return rows;
}

function parseDateTime(date: string, dateType: CountryType): Date {
  const dateArr = date.split("/").map(Number);
  const day = dateType === "GB" ? dateArr[0] : dateArr[1];
  const month = dateType === "GB" ? dateArr[1] : dateArr[0];
  const year = dateArr[2];

  const dateTime = new Date(year, month - 1, day);

  return dateTime;
}

function convertToHours(time) {
  const [timeOfDay, marker] = time.split(" ");
  let [hours, minutes] = timeOfDay.split(":").map(Number);

  //convert to 24hr
  hours = (hours % 12) + (marker === "PM" ? 12 : 0);
  //round hour up
  if (minutes > 30) {
    hours = (hours + 1) % 24;
  }

  return hours;
}

function checkIfPlaceholder(value: string) {
  const checked = value === '="-"' || value === "N/A" ? "0" : value;
  return checked;
}

function parseMoney(value: string): Prisma.Decimal {
  const checkedValue = checkIfPlaceholder(value);
  const money = new Prisma.Decimal(checkedValue.replace(/[\p{Sc}]/gu, ""));

  return money;
}

function generateSaleId(row: CSVRow): string {
  const idFields = ["Date of sale", "Time of sale", "Bundle", "Buyer"];
  const hash = generateIdHash(idFields, row);
  return hash;
}

function generateItemId(row: CSVRow): string {
  const idFields = [
    "Date of sale",
    "Time of sale",
    "Date of listing",
    "Bundle",
    "Buyer",
    "Description",
    "Size",
    "Item price",
    "Buyer shipping cost",
    "Total",
    "Depop fee",
    "Depop Payments fee",
    "Boosting fee",
    "Payment type",
    "City",
    "Country",
    "Refunded to buyer amount",
    "Fees refunded to seller",
  ];

  const hash = generateIdHash(idFields, row);
  return hash;
}

function checkFieldMap(value: string): string {
  if (!fieldMap.hasOwnProperty(value)) return value;

  const checked = fieldMap[value];
  return checked;
}

const fieldMap = {
  "N/A": "Other",
  "**ANONYMIZED**": "Other",
  Sweaters: "Jumpers",
} as const;

function getUserCountry(row: CSVRow): CountryType {
  const currencySymbol = row["Item price"].charAt(0);

  return currencySymbol === "$" ? "USA" : "GB";
}

export {
  hashFileData,
  createSalesData,
  csvToJson,
  generateIdHash,
  fieldMap,
  checkFieldMap,
  parseDateTime,
  parseMoney,
  convertToHours,
  generateItemId,
  generateSaleId,
  getUserCountry,
};
