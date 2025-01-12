import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

async function groupItems(
  args: Prisma.ItemGroupByArgs & {
    orderBy: Prisma.ItemGroupByArgs["orderBy"];
  },
) {
  const grouped = await prisma.item.groupBy(args);
  return grouped;
}

export { groupItems };
