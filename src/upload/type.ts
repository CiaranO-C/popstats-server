
interface CSVRow {
  [key: string]: string;
}

type CSVFile = Array<CSVRow>;

interface FieldMapType {
  "N/A": "Other";
  "**ANONYMIZED**": "Other";
  "Sweaters": "Jumpers";
}

export type { CSVRow, CSVFile, FieldMapType };
