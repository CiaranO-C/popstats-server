import { Prisma } from "@prisma/client";

interface CSVRow {
  [key: string]: string;
}

type CSVFile = Array<CSVRow>;

type DataCategory = "buyer" | "sale" | "item";

export type { CSVRow, CSVFile, DataCategory };
