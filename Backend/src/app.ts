import express from 'express';
import cors from 'cors';
import dotenv, { config } from 'dotenv';
import authRoutes from './routes/auth.routes';
import donorProfileRoutes from './routes/donor.routes';
import hospitalProfileRoutes from './routes/hospital.routes';
import bloodRequestRoutes from './routes/Bloodrequest.routes';
import donationRoutes from './routes/donation.routes';
import eventRoutes from './routes/Event.routes';
import eventRegistrationRoutes from './routes/Eventregistration.routes';
import bloodRequestResponseRoutes from './routes/bloodRequestResponse.routes';
import chatbotRoutes from "./routes/chatbot.routes";
import adminRoutes from './routes/admin.routes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/donor/profile', donorProfileRoutes);


app.use('/api/hospital/profile', hospitalProfileRoutes);


app.use('/api/blood-requests', bloodRequestRoutes);


app.use('/api/donations', donationRoutes);


app.use('/api/events', eventRoutes);

app.use('/api/event-registrations', eventRegistrationRoutes);


app.use('/api/blood-request-responses', bloodRequestResponseRoutes);
app.use('/api/chat', chatbotRoutes);

app.use('/api/admin', adminRoutes);

export default app;
