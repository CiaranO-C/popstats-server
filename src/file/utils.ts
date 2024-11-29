import { Prisma } from "@prisma/client";
import { CSVRow, FieldMapType } from "./type";
import XXH from "xxhashjs";

function parseDateTime(date: string, time = "0:00 AM"): Date {
  const [day, month, year] = date.split("/").map(Number);
  const [timeOfDay, marker] = time.split(" ");
  let [hours, minutes] = timeOfDay.split(":").map(Number);

  if (marker === "PM" && hours < 12) hours += 12;
  if (marker === "AM" && hours === 12) hours = 0;

  const dateTime = new Date(year, month - 1, day, hours, minutes);

  return dateTime;
}

function parseMoney(value: string): Prisma.Decimal {
  const checkedValue = value === '="-"' || value === "N/A" ? "0" : value;
  const money = new Prisma.Decimal(checkedValue.replace("£", ""));

  return money;
}

function generateSaleId(row: CSVRow): string {
  const id = `${row["Date of sale"]}-${row["Time of sale"]}-${row["Bundle"]}-${row["Buyer"]}`;
  return id;
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

  let toHash: string = "";
  idFields.forEach((field) => (toHash += row[field]));
  const hash = XXH.h32(toHash, 0).toString(16);

  return hash;
}

function hashFileData(fileData: string) {
  const hash = XXH.h32(fileData, 0xabcd).toString(16);
  return hash;
}

function checkFieldMap(value: string): string {
  if (!fieldMap.hasOwnProperty(value)) return value;

  const checked = fieldMap[value];
  return checked;
}

const fieldMap: FieldMapType = {
  "N/A": "Other",
  "**ANONYMIZED**": "Other",
  "Sweaters": "Jumpers",
};

export {
  generateSaleId,
  generateItemId,
  parseDateTime,
  parseMoney,
  checkFieldMap,
  hashFileData,
};
