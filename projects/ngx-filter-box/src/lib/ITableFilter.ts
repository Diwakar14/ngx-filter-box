import { ITableHeader } from './ITableHeader';

export interface ITableFilter {
  sortedDataRow: any[];
  dataRow: any[];
  headers: ITableHeader[];
}
