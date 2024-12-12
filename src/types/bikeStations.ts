export interface DublinBikeStation {
  id: number;
  'Harvest Time (UTC)': string | null;
  'Station id': number;
  'Available Bike-Stands': number;
  'Bike-Stands': number;
  'Available Bikes': number;
  banking: boolean;
  bonus: boolean;
  'Last Update': string;
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
  Address: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
}

export interface SchemaField {
  display: string;
  name: string;
  type: string;
  options: string[];
}

export interface FilteredDataResponse {
  data: DataItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export type Operator = 'eq' | 'lt' | 'gt' | 'not';
export type FilterCondition = { [operator in Operator]?: string | number };
export type WhereClause = { [fieldName: string]: FilterCondition };
export type OrderBy = { field: string; direction: 'asc' | 'desc' };
export type FieldMap = Record<string, string>;

export type Value = number | string | boolean | null | undefined;

export type DataItem = Record<string, Value>;
