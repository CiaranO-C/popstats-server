import { convertBigInts } from "../../../utils/convert.js";
import { buyersByCountry } from "../../db.js";

async function getBuyersByCountry(parent, args, context) {
  const { userId } = context;
  const buyers = await buyersByCountry(userId);
  const convertedBuyers = convertBigInts(buyers, ["country"]);

  return convertedBuyers;
}

export { getBuyersByCountry };
