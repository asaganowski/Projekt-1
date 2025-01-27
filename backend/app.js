import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';
import placowkiRoutes from './src/routes/placowki.js';
import appointmentsRoutes from './src/routes/appointments.js';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/placowki', placowkiRoutes);
app.use('/api/appointments', appointmentsRoutes);

export default app;
