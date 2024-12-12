import axios from 'axios';
import { DATA_URL } from '../config/constants';
import { deriveSchema } from './schemaService';
import {
  DataItem,
  DublinBikeStation,
  FilteredDataResponse,
  OrderBy,
  Value,
  WhereClause,
} from '../types/bikeStations';
import { applySchemaToData } from '../utils/normalizeUtils';

// Apply filters based on the "where" conditions and schema mapping
const applyFilters = (
  data: Record<string, Value>[],
  where: WhereClause
): Record<string, Value>[] => {
  return data.filter((item) => {
    return Object.entries(where).every(([field, condition]) => {
      const value = item[field];

      return Object.entries(condition).every(([operator, conditionValue]) => {
        // Apply filtering based on operator
        switch (operator) {
          case 'eq':
            return value === conditionValue;
          case 'lt':
            return (
              typeof value === 'number' && value < (conditionValue as number)
            );
          case 'gt':
            return (
              typeof value === 'number' && value > (conditionValue as number)
            );
          case 'not':
            return value !== conditionValue;
          default: // Unsupported operator
            console.warn(
              `Unsupported operator "${operator}" for field "${field}"`
            );
            return false;
        }
      });
    });
  });
};

// Sort data based on "orderBy" parameters
const applySorting = (
  data: Record<string, Value>[],
  orderBy: OrderBy | undefined
): Record<string, Value>[] => {
  if (!orderBy) return data;

  const { field, direction } = orderBy;

  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const comparison = (aValue ?? '')
      .toString()
      .localeCompare((bValue ?? '').toString());

    return direction === 'asc' ? comparison : -comparison;
  });
};

// Paginate the data based on "page" and "pageSize"
const applyPagination = (
  data: Record<string, Value>[],
  page: number,
  pageSize: number
): { paginatedData: Record<string, Value>[]; totalRecords: number } => {
  const offset = (page - 1) * pageSize;
  const paginatedData = data.slice(offset, offset + pageSize);
  const totalRecords = data.length;

  return { paginatedData, totalRecords };
};

export const fetchFilteredData = async (body: {
  where?: WhereClause;
  orderBy?: OrderBy;
  page?: number;
  pageSize?: number;
}): Promise<FilteredDataResponse> => {
  const { where = {}, orderBy, page = 1, pageSize = 10 } = body;
  const { data } = await axios.get<DublinBikeStation[]>(DATA_URL);

  // Derive schema and ensure it is valid
  const schema = await deriveSchema();
  if (!schema || schema.length === 0) {
    throw new Error('Schema could not be derived or is empty');
  }

  // Normalize dataset and retrieve field map using provided schema
  const { normalizedData } = applySchemaToData(data, schema);

  // Apply filters, sorting, and pagination on normalized data
  const filteredData = applyFilters(normalizedData, where);
  const sortedData = applySorting(filteredData, orderBy);
  const { paginatedData, totalRecords } = applyPagination(
    sortedData,
    page,
    pageSize
  );

  if (!totalRecords) {
    return {
      data: [],
      pagination: { page, pageSize, totalRecords: 0, totalPages: 0 },
    };
  }

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    },
  };
};

export const fetchStationById = async (id: number): Promise<DataItem> => {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error('Invalid station ID');
  }

  const { data } = await axios.get<DublinBikeStation[]>(DATA_URL);
  const schema = await deriveSchema();

  const station = data.find((station) => station.id === id);

  if (!station) {
    throw new Error(`Station with ID ${id} not found`);
  }

  // Normalize the single station using provided schema
  const { normalizedData: normalizedStation } = applySchemaToData(
    [station],
    schema
  );

  return normalizedStation[0];
};
