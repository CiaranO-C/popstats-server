import { Prisma } from "@prisma/client";

async function validateFile(
  hash: string,
  userId: number,
  tx: Prisma.TransactionClient,
) {
  const hashExists = await tx.file.findUnique({
    where: {
      hash_ownerId: {
        hash,
        ownerId: userId,
      },
    },
  });

  if (hashExists) return false;
  return true;
}

async function createFileEntry(
  ownerId: number,
  hash: string,
  tx: Prisma.TransactionClient,
) {
  const entry = await tx.file.create({
    data: {
      hash,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
  });
  return entry;
}

async function createLocations(
  locations: Prisma.LocationCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.location.createMany({
    data: locations,
    skipDuplicates: true,
  });
}

async function createBuyers(
  buyers: Prisma.BuyerCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.buyer.createMany({
    data: buyers,
    skipDuplicates: true,
  });
}

async function createUserBuyers(
  relations: Prisma.UserBuyerCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.userBuyer.createMany({
    data: relations,
    skipDuplicates: true,
  });
}

async function createBuyerLocations(
  relations: Prisma.BuyerLocationCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.buyerLocation.createMany({
    data: relations,
    skipDuplicates: true,
  });
}

async function createSales(
  sales: Prisma.SaleCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.sale.createMany({
    data: sales,
    skipDuplicates: true,
  });
}

async function createItems(
  items: Prisma.ItemCreateManyInput[],
  tx: Prisma.TransactionClient,
) {
  await tx.item.createMany({
    data: items,
    skipDuplicates: true,
  });
}

export {
  validateFile,
  createBuyerLocations,
  createBuyers,
  createFileEntry,
  createItems,
  createLocations,
  createSales,
  createUserBuyers,
};
