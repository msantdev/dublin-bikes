import axios from 'axios';
import Field from '../models/fieldModel';
import { determineType } from '../utils/typeUtils';
import { DATA_URL } from '../config/constants';
import { DataItem } from '../types/bikeStations';
import { normalizeName, normalizeValue } from '../utils/normalizeUtils';

export const deriveSchema = async (): Promise<Field[]> => {
  try {
    const { data } = await axios.get<DataItem[]>(DATA_URL);

    if (!data || data.length === 0) {
      console.warn('The dataset is empty');
      return [];
    }

    const keys = Array.from(new Set(data.flatMap(Object.keys)));

    return keys.map((key) => {
      const values = data
        .map((item) => item[key])
        .filter((val): val is NonNullable<typeof val> => val != null);

      if (values.length === 0) {
        console.warn(`No values found for key: ${key}`);
        return new Field(key, normalizeName(key), 'TEXT', []);
      }

      const normalizedValues = values.map(normalizeValue);
      const type = determineType(normalizedValues);

      const options =
        type === 'OPTION'
          ? Array.from(new Set(normalizedValues.map(String)))
          : [];

      return new Field(key, normalizeName(key), type, options);
    });
  } catch (error) {
    console.error('Error deriving schema:', error);
    throw new Error('Failed to derive schema from the dataset');
  }
};
