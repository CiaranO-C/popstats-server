//cron job script to clean up orphaned data in DB
import prisma from "../config/prisma";

async function deleteOrphanedRecords() {
  try {
    const cleanup = await prisma.$transaction(async (tx) => {
      const buyersDeleted = await tx.buyer.deleteMany({
        where: {
          users: { none: {} },
        },
      });

      const locationsDeleted = await tx.location.deleteMany({
        where: {
          buyerLocations: { none: {} },
        },
      });

      const deletions = [
        { count: buyersDeleted.count, title: "Buyers" },
        { count: locationsDeleted.count, title: "Locations" },
      ];
      return deletions;
    });

    const currentDate = new Date().toISOString();
    console.log(`Cleanup transaction successful, on: ${currentDate}`);

    cleanup.forEach((deleted) => {
      console.log(
        `${deleted.count > 0 ? deleted.count + " " + deleted.title + " were deleted." : "No orphaned " + deleted.title + " found."}`,
      );
    });
  } catch (error) {
    console.error("Cleanup unsuccessful --> ", error);
  }
}

deleteOrphanedRecords();
