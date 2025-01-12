import { groupSales } from "../../../sales/db.js";

async function getRepeatBuyers(parent, args, context) {
  const { userId } = context;

  const res = (await groupSales({
    by: ["buyerId"],
    where: { userId },
    _count: {
      id: true,
    },
    having: {
      id: { _count: { gt: 1 } },
    },
    orderBy: { buyerId: "asc" },
  })) as { _count: { id: number }; buyerId: string }[];

  const buyers = res.map(({ _count, buyerId }) => {
    const bought = _count.id;
    return {
      bought,
      buyer: buyerId,
    };
  });

  return {
    buyers,
    count: buyers.length,
  };
}

export { getRepeatBuyers };
