function convertBigInts(
  dataArr: { [field: string]: Date | bigint | string }[],
  keysToIgnore: string[],
) {
  const converted = dataArr.map((row) => {
    const rowArr = Object.entries(row);
    const converted = rowArr.map(([key, value]) => {
      if (keysToIgnore.includes(key)) return [key, value];
      return [key, Number(value)];
    });

    return Object.fromEntries(converted);
  });
  return converted;
}

export { convertBigInts };
