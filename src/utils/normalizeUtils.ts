import { camelCase } from 'lodash';
import { DublinBikeStation, FieldMap, Value } from '../types/bikeStations';

// Normalize the dataset by transforming keys to camelCase and processing values
export const normalizeDataset = (
  data: DublinBikeStation[],
  fieldMap: FieldMap
): Record<string, Value>[] => {
  return data.map((item) => {
    const normalizedItem: Record<string, Value> = {};
    for (const [normalizedName, originalName] of Object.entries(fieldMap)) {
      const originalValue = item[originalName as keyof DublinBikeStation];
      normalizedItem[normalizedName] = normalizeValue(originalValue);
    }
    return normalizedItem;
  });
};

export const normalizeName = (displayName: string): string => {
  return camelCase(displayName);
};

export const normalizeValue = (value: Value): Value => {
  if (typeof value !== 'string') return value;

  const booleanMap: Record<string, boolean> = {
    true: true,
    false: false,
  };

  // Check if the string value matches a boolean representation.
  if (value.toLowerCase() in booleanMap) return booleanMap[value.toLowerCase()];

  // Attempt to convert the string to a number.
  const num = Number(value);
  if (!isNaN(num)) return num; // Return the number if conversion is successful.

  // Check if the string can be parsed into a valid date.
  const parsedDate = new Date(value);
  if (!isNaN(parsedDate.getTime())) return parsedDate.toISOString(); // Return the ISO string for valid dates.

  // If none of the above cases apply, return the value as it is.
  return value;
};

export const applySchemaToData = (
  data: DublinBikeStation[],
  schema: { name: string; display: string }[]
): { normalizedData: Record<string, Value>[]; fieldMap: FieldMap } => {
  const fieldMap: FieldMap = {};
  for (const field of schema) {
    fieldMap[field.name] = field.display;
  }

  const normalizedData = normalizeDataset(data, fieldMap);
  return { normalizedData, fieldMap };
};
