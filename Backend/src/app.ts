import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import donorProfileRoutes from './routes/donor.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/donor/profile', donorProfileRoutes);

export default app;
