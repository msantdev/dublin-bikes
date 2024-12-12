import { THRESHOLDS } from '../config/constants';
import { Value } from '../types/bikeStations';

export const determineType = (normalizedValues: Value[]): string => {
  // Create a Set to extract unique values from the input array.
  const uniqueValues = new Set(normalizedValues);
  const totalCount = normalizedValues.length;
  const uniqueCount = uniqueValues.size;

  // If all values are booleans (true or false), classify as BOOLEAN.
  if ([...uniqueValues].every((v) => typeof v === 'boolean')) return 'BOOLEAN';

  // If all values are integers, classify as INTEGER.
  if ([...uniqueValues].every((v) => Number.isInteger(v))) return 'INTEGER';

  // If all values are numbers (floats or integers), classify as FLOAT.
  if ([...uniqueValues].every((v) => typeof v === 'number')) return 'FLOAT';

  // If all values are valid date strings, classify as DATE.
  if (
    [...uniqueValues].every(
      (v) => typeof v === 'string' && !isNaN(Date.parse(v))
    )
  )
    return 'DATE';

  // Classification as "OPTION" based on thresholds:
  // - Absolute threshold: Number of unique values should be small.
  // - Relative threshold: Proportion of unique values to total values should be low.
  if (
    uniqueCount <= THRESHOLDS.absolute &&
    uniqueCount / totalCount <= THRESHOLDS.relative
  ) {
    return 'OPTION';
  }

  // Default classification as "TEXT" if no other type matches.
  return 'TEXT';
};
