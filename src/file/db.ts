import { UserType } from "../user/type";
import { createTemporaryUser } from "../user/db";
import { CSVFile, CSVRow } from "./type";
import { checkFieldMap, prepareBuyerData } from "./utils";
import prisma from "../../config/prisma";

async function createDbEntry(row: CSVRow, userId: number) {
  //create many to utilise skip duplicates option
  await prisma.location.createMany({
    data: [
      {
        country: checkFieldMap<string>("country", row["Country"]),
      },
    ],
    skipDuplicates: true,
  });

  const buyerData = prepareBuyerData(row, userId);

  await prisma.buyer.upsert({
    where: { username: row["Buyer"] },
    create: buyerData,
    update: {
      locations: buyerData.locations,
    },
  });
}

async function createSalesData(user: UserType | null, data: CSVFile) {
  if (user === null) user = await createTemporaryUser();
  const { id: userId } = user;

  const promiseArray = data.map(
    (row) => async () => createDbEntry(row, userId),
  );

  await Promise.all(promiseArray.map((fn) => fn()));
}

export { createSalesData };
