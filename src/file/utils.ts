import { Prisma } from "@prisma/client";
import { CSVRow, FieldMapType } from "./type";

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

function checkFieldMap(value: string): string {
  if (!fieldMap.hasOwnProperty(value)) return value;

  const checked = fieldMap[value];
  return checked;
}

const fieldMap: FieldMapType = {
  "N/A": "Other",
  "**ANONYMIZED**": "Other",
};

export { generateSaleId, parseDateTime, parseMoney, checkFieldMap };
