declare module "csv-parser" {
  import { Readable } from "stream";

  interface CsvParserOptions {
    separator?: string;
    quote?: string;
    escape?: string;
    newline?: string;
    strict?: boolean;
    headers?: string[] | boolean;
    mapHeaders?: (args: { header: string; index: number }) => string | null;
    mapValues?: (args: { header: string; index: number; value: string }) => any;
  }

  function csv(options?: CsvParserOptions): Readable;

  export = csv;
}
