import { PrismaClient } from "@prisma/client";

const env = process.env.NODE_ENV;
const databaseUrl =
  env === "test"
    ? process.env.TEST_DATABASE_URL
    : env === "development"
      ? process.env.DATABASE_URL_DEV
      : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;
