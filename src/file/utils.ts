import { Prisma } from "@prisma/client";
import { dataCategories } from "./fileData";
import { CSVRow, FieldMapType } from "./type";

function getLocation(row: CSVRow): Prisma.LocationCreateWithoutBuyersInput {
  const { location: headings } = dataCategories;
  const entry: Prisma.LocationCreateWithoutBuyersInput = {
    country: "",
  };

  for (let i = 0; i < headings.length; i++) {
    const { heading, name } = headings[i];
    const value = checkFieldMap(name, row[heading]);
    entry[name] = value;
  }

  return entry;
}

function parseDateTime(date: string, time: string): Date {
  const [day, month, year] = date.split("/").map(Number);
  const [timeOfDay, marker] = time.split(" ");
  let [hours, minutes] = timeOfDay.split(":").map(Number);

  if (marker === "PM" && hours < 12) hours += 12;
  if (marker === "AM" && hours === 12) hours = 0;

  const dateTime = new Date(year, month - 1, day, hours, minutes);
  console.log("parsed date --> ", dateTime);

  return dateTime;
}

function parseMoney(value: string): Prisma.Decimal {
  const money = new Prisma.Decimal(value.replace("£", "").replace("N/A", "0"));
  console.log("parsed money --> ", money);
  return money;
}

function prepareBuyerData(
  row: CSVRow,
  userId: number,
): Prisma.BuyerCreateWithoutBoughtInput {
  return {
    username: row["Buyer"],
    locations: {
      connect: [
        {
          country: checkFieldMap<string>("country", row["Country"]),
        },
      ],
    },
    user: { connect: { id: userId } },
  };
}

function checkFieldMap<outType>(key: string, value: string): outType | string {
  if (!fieldMap.hasOwnProperty(value)) return value;

  const checked =
    value === '="-"' || value === "N/A"
      ? fieldMap[value](key)
      : fieldMap[value];
  return checked;
}

const fieldMap: FieldMapType = {
  No: false,
  Yes: true,
  "N/A": (key: string) => {
    if (key === "refund" || key === "feeRefund") return "";
    if (key === "brand") return "Other";
  },
  "**ANONYMIZED**": "Other",
  '="-"': (key: string) => {
    if (key === "customShipPrice" || key === "total") return "£0.00";
  },
};

export { prepareBuyerData, checkFieldMap };
