import { UserType } from "../user/type";
import { createTemporaryUser } from "../user/db";
import { CSVFile, CSVRow } from "./type";
import { prepareBuyerData } from "./utils";
import prisma from "../../config/prisma";

async function createDbEntry(row: CSVRow, userId: number) {

  //create many to utilise skip duplicates option
  await prisma.location.createMany({
    data: [{ city: row["City"], country: row["Country"] }],
    skipDuplicates: true,
  });

  const buyerData = prepareBuyerData(row, userId);
  await prisma.buyer.upsert({
    where: { username: row['Buyer']},
    create: buyerData.entry,
    update: {
      locations: buyerData.entry.locations
    }
  })
}

async function createSalesData(user: UserType | null, data: CSVFile) {
  if (user === null) user = await createTemporaryUser();
  const { id: userId } = user;

  for(let i = 0; i < data.length; i++){
    const row = data[i];
    await createDbEntry(row, userId);
  }
}

export { createSalesData };
