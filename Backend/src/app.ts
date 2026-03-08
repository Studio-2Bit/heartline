import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import donorProfileRoutes from './routes/donor.routes';
import hospitalProfileRoutes from './routes/hospital.routes';
import bloodRequestRoutes from './routes/Bloodrequest.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/donor/profile', donorProfileRoutes);


app.use('/api/hospital/profile', hospitalProfileRoutes);


app.use('/api/blood-requests', bloodRequestRoutes);

export default app;
