import { convertBigInts } from "../../../utils/convert";
import { buyersByCountry } from "../../db";

async function getBuyersByCountry(parent, args, context) {
  const { userId } = context;
  const buyers = await buyersByCountry(userId);
  const convertedBuyers = convertBigInts(buyers, ["country"]);

  return convertedBuyers;
}

export { getBuyersByCountry };
