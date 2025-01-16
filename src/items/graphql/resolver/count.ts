import { countItems } from "../../db.js";

async function getItemCount(parent, args, context): Promise<number> {
  const { userId } = context;
  const count = await countItems({ where: { userId } });
  return count;
}

export { getItemCount };
