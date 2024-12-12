import axios from 'axios';
import { mockedBikeStations } from '../mocks/stationMocks';
import {
  fetchFilteredData,
  fetchStationById,
} from '../../services/dataService';
import { OrderBy, WhereClause } from '../../types/bikeStations';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

type FilteredDataBody = {
  where?: WhereClause;
  orderBy?: OrderBy;
  page?: number;
  pageSize: number;
};

describe('DataService Tests', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockedBikeStations });
  });

  describe('fetchFilteredData', () => {
    it('should return filtered and sorted data', async () => {
      const mockBody: FilteredDataBody = {
        where: { availableBikes: { gt: 10 } },
        orderBy: { field: 'availableBikes', direction: 'asc' },
        page: 1,
        pageSize: 10,
      };

      const expectedData = [
        { id: 10, name: 'Station J', availableBikes: 11, status: 'OPEN' },
        { id: 4, name: 'Station D', availableBikes: 12, status: 'MAINTENANCE' },
        { id: 11, name: 'Station K', availableBikes: 13, status: 'OPEN' },
        { id: 9, name: 'Station I', availableBikes: 14, status: 'MAINTENANCE' },
        { id: 2, name: 'Station B', availableBikes: 15, status: 'CLOSED' },
        { id: 15, name: 'Station O', availableBikes: 15, status: 'CLOSED' },
        { id: 17, name: 'Station Q', availableBikes: 16, status: 'OPEN' },
        { id: 7, name: 'Station G', availableBikes: 18, status: 'OPEN' },
        { id: 14, name: 'Station N', availableBikes: 19, status: 'OPEN' },
        { id: 6, name: 'Station F', availableBikes: 20, status: 'OPEN' },
        { id: 18, name: 'Station R', availableBikes: 20, status: 'CLOSED' },
      ];

      const result = await fetchFilteredData(mockBody);

      expect(result.data).toEqual(expectedData.slice(0, 10));
      expect(result.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          totalRecords: expectedData.length,
          totalPages: Math.ceil(expectedData.length / mockBody.pageSize),
        })
      );
    });

    it('should handle no filters gracefully', async () => {
      const mockBody: FilteredDataBody = { page: 1, pageSize: 10 };

      const expectedData = mockedBikeStations.slice(0, 10);

      const result = await fetchFilteredData(mockBody);

      expect(result.data).toEqual(expectedData);
      expect(result.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          totalRecords: mockedBikeStations.length,
          totalPages: 2,
        })
      );
    });

    it('should paginate results correctly', async () => {
      const mockBody: FilteredDataBody = { page: 2, pageSize: 5 };

      const expectedData = mockedBikeStations.slice(5, 10);

      const result = await fetchFilteredData(mockBody);

      expect(result.data).toEqual(expectedData);
      expect(result.pagination).toEqual(
        expect.objectContaining({
          page: 2,
          pageSize: 5,
          totalRecords: mockedBikeStations.length,
          totalPages: 4,
        })
      );
    });
  });

  describe('fetchStationById', () => {
    it('should return a station by ID', async () => {
      const stationId = 1;

      const expectedStation = {
        id: 1,
        name: 'Station A',
        availableBikes: 10,
        status: 'OPEN',
      };

      const station = await fetchStationById(stationId);

      expect(station).toEqual(expectedStation);
    });

    it('should throw an error if station is not found', async () => {
      const invalidId = 9999;

      await expect(fetchStationById(invalidId)).rejects.toThrow(
        `Station with ID ${invalidId} not found`
      );
    });
  });
});
