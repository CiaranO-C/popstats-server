import { Prisma } from "@prisma/client";
import { CSVRow, FieldMapType } from "./type";
import XXH from "xxhashjs";
import { generateIdHash } from "../upload/utils";

function parseDateTime(date: string): Date {
  const [day, month, year] = date.split("/").map(Number);
  const dateTime = new Date(year, month - 1, day);

  return dateTime;
}

function convertToHours(time: string): number {
  const [timeOfDay, marker] = time.split(" ");
  let [hours, minutes] = timeOfDay.split(":").map(Number);
  //round to nearest hour
  hours = minutes > 30 ? hours + 1 : hours;

  if (marker === "AM" && hours === 12) {
    hours = 0;
  }
  if (marker === "PM" && hours !== 12) {
    hours += 12;
  }

  return hours;
}

function parseMoney(value: string): Prisma.Decimal {
  const checkedValue = value === '="-"' || value === "N/A" ? "0" : value;
  const money = new Prisma.Decimal(checkedValue.replace("£", ""));

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
  Sweaters: "Jumpers",
};

export {
  generateSaleId,
  generateItemId,
  parseDateTime,
  convertToHours,
  parseMoney,
  checkFieldMap,
  hashFileData,
};
