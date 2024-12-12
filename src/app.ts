import express from 'express';
import schemaRoutes from './routes/schemaRoutes';
import dataRoutes from './routes/dataRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/schema', schemaRoutes);
app.use('/data', dataRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
