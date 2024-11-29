//cron job script to remove temporary users older than or equal to 1hr
import prisma from "../config/prisma";

async function deleteTemporaryUsers() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { count } = await prisma.user.deleteMany({
      where: {
        temporary: true,
        createdAt: { lte: oneHourAgo },
      },
    });
    const usersFound = count > 0;
    const userString = count > 1 ? "users" : "user";
    console.log(
      `Delete temporary users successful, on: ${new Date().toISOString()}`,
    );
    console.log(
      `${usersFound ? count + " temporary " + userString + " deleted." : "No temporary users older than 1hr found."}`,
    );
  } catch (error) {
    console.error("Error deleting temporary users", error);
  }
}

deleteTemporaryUsers();
