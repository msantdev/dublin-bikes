import { Router } from 'express';
import { getFilteredData, getStationById } from '../controllers/dataController';
import { validateSchema } from '../middlewares/schemaValidator';
import { postDataSchema } from '../schemas/postDataSchema';

const router = Router();

router.post('/', validateSchema(postDataSchema), getFilteredData);
router.get('/:id', getStationById);

export default router;
