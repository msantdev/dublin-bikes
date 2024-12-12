import { NextFunction, Request, Response } from 'express';
import { fetchFilteredData, fetchStationById } from '../services/dataService';

export const getFilteredData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filteredData = await fetchFilteredData(req.body);
    res.json(filteredData);
  } catch (error) {
    next(error);
  }
};

export const getStationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    const station = await fetchStationById(id);
    res.json(station);
  } catch (error) {
    next(error);
  }
};
