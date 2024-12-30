import { DateGroup } from "./type";

function groupDates(data, group: DateGroup) {
  const groupedData = {};
  for (let i = 0; i < data.length; i++) {
    const { _sum, dateOfSale } = data[i];
    const total = parseFloat(_sum.total);
    const date = new Date(dateOfSale);
    let dateInfo: number;
    switch (group) {
      case "day":
        dateInfo = date.getUTCDay();
        break;
      case "month":
        dateInfo = date.getUTCMonth();
        break;
      case "year":
        dateInfo = date.getUTCFullYear();
        break;
    }
    if (groupedData.hasOwnProperty(dateInfo)) {
      groupedData[dateInfo].total += total;
      groupedData[dateInfo].length++;
      continue;
    }
    groupedData[dateInfo] = { total, length: 1 };
  }
  return groupedData;
}

function groupDateAverage(data, group: DateGroup) {
  const dateData: { [field: string]: { total: number; length: number } } =
    groupDates(data, group);
  const averageArr = Object.entries(dateData).map((date) => {
    const average = date[1].total / date[1].length;
    return {
      average: average.toFixed(2),
      date: date[0],
    };
  });

  return averageArr;
}

export { groupDates, groupDateAverage };
