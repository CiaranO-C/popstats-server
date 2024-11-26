
interface CSVRow {
  [key: string]: string;
}

type CSVFile = Array<CSVRow>;

interface FieldMapType {
  "N/A": "Other";
  "**ANONYMIZED**": "Other";
}

export type { CSVRow, CSVFile, FieldMapType };
