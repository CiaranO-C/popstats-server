import { DateGroup } from "./type.js";

function groupDates(data, group: DateGroup) {
  const groupedData = {};
  for (let i = 0; i < data.length; i++) {
    const { _sum, dateOfSale } = data[i];
    const total = parseFloat(_sum.total);
    const date = new Date(dateOfSale);
    let dateInfo: number;
    switch (group) {
      case "day":
        console.log(date);
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
    groupedData[dateInfo] = { total, length: 1, date };
  }
  return groupedData;
}

function groupDateAverage(data, group: DateGroup) {
  const dateData: {
    [field: string]: { total: number; length: number; date: Date };
  } = groupDates(data, group);

  const averageArr = Object.values(dateData).map(({ total, length, date }) => {
    const average = total / length;
    return {
      average: average.toFixed(2),
      date: date.toISOString(),
    };
  });

  return averageArr;
}

export { groupDates, groupDateAverage };
