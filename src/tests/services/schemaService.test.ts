import axios from 'axios';
import { deriveSchema } from '../../services/schemaService';
import Field from '../../models/fieldModel';
import { mockedBikeStations } from '../mocks/stationMocks';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('deriveSchema', () => {
  it('should return an empty array if the dataset is empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const schema = await deriveSchema();

    expect(schema).toEqual([]);
  });

  it('should derive schema correctly from dataset', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockedBikeStations });

    const schema = await deriveSchema();

    expect(schema).toEqual([
      new Field('id', 'id', 'INTEGER', []),
      new Field('name', 'name', 'TEXT', []),
      new Field('availableBikes', 'availableBikes', 'INTEGER', []),
      new Field('status', 'status', 'OPTION', [
        'OPEN',
        'CLOSED',
        'MAINTENANCE',
      ]),
    ]);
  });

  it('should handle fields with all null values', async () => {
    const nullData = mockedBikeStations.map((item) => ({
      ...item,
      name: null,
      status: null,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: nullData });

    const schema = await deriveSchema();

    expect(schema).toEqual([
      new Field('id', 'id', 'INTEGER', []),
      new Field('name', 'name', 'TEXT', []),
      new Field('availableBikes', 'availableBikes', 'INTEGER', []),
      new Field('status', 'status', 'TEXT', []),
    ]);
  });

  it('should derive schema with predefined options for "status"', async () => {
    const statusData = mockedBikeStations.map((item) => ({
      id: item.id,
      status: item.status,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: statusData });

    const schema = await deriveSchema();

    expect(schema).toEqual([
      new Field('id', 'id', 'INTEGER', []),
      new Field('status', 'status', 'OPTION', [
        'OPEN',
        'CLOSED',
        'MAINTENANCE',
      ]),
    ]);
  });
});
