import { Prisma } from "@prisma/client";

interface CSVRow {
  [key: string]: string;
}

interface FileItem {
  [key: string]: string;
}

interface EntryItem {
  [key: string]: string | boolean | number;
}

type FileData = Array<FileItem>;

type DataCategory = "buyer" | "sale" | "item";

export type { CSVRow, FileData, FileItem, EntryItem, DataCategory };
