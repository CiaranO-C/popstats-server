import { Prisma } from "@prisma/client";
import { dataCategories, fieldMap } from "./fileData";
import { CSVRow, FileItem } from "./type";

/*function prepareData(data: FileData, userId: number) {
  const locationData: Prisma.LocationCreateManyInput[] = [];
  const buyerData: Prisma.BuyerCreateWithoutBoughtInput[] = [];
  for (let i = 0; i < data.length; i++) {
    const item: FileItem = data[i];
    locationData.push(getLocation(item));
    buyerData.push(getBuyer(item));
  }

  return { locationData, buyerData };
}*/

/*function getBuyer(data: FileItem): {
  relation: Prisma.BuyerCreateNestedManyWithoutUserInput;
  entry: Prisma.BuyerCreateWithoutBoughtInput;
} {
  const { dbRelation, db } = dataCategories.buyer;
  const entryData = { relation: {}, entry: {} };

  for (let i = 0; i < db.length; i++) {
    const { heading, name } = db[i];
    const value = checkMap(name, data[heading]);
    if (value === "") continue;
    entryData.entry[name] = value;
  }

  for (let i = 0; i < dbRelation.length; i++) {
    const { heading, name } = dbRelation[i];
    const value = checkMap(name, data[heading]);
    if (value === "") continue;
    entryData.relation[name] = value;
  }

  return entryData;
}*/

function getLocation(data: FileItem): Prisma.LocationCreateWithoutBuyersInput {
  const { location: headings } = dataCategories;
  const entry: Prisma.LocationCreateWithoutBuyersInput = {
    city: "",
    country: "",
  };

  for (let i = 0; i < headings.length; i++) {
    const { heading, name } = headings[i];
    const value = checkMap(name, data[heading]);
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

function checkMap(key: string, value: string): string | boolean | "" {
  let checked = value;
  if (fieldMap.hasOwnProperty(value)) {
    checked =
      value === '="-"' || value === "N/A"
        ? fieldMap[value](key)
        : fieldMap[value];
  }

  return checked;
}

function prepareBuyerData(
  row: CSVRow,
  userId: number,
): {
  relation: Prisma.BuyerCreateNestedManyWithoutUserInput;
  entry: Prisma.BuyerCreateWithoutBoughtInput;
} {
  return {
    relation: {
      create: [
        {
          username: row["Buyer"],
          locations: {
            connect: [
              {
                city_country: {
                  city: row["City"],
                  country: row["Country"],
                },
              },
            ],
          },
        },
      ],
    },
    entry: {
      username: row["Buyer"],
      locations: {
        connect: [
          {
            city_country: {
              city: row["City"],
              country: row["Country"],
            },
          },
        ],
      },
      user: { connect: { id: userId } },
    },
  };
}

export { prepareBuyerData };
