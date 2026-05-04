// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes'; // Import novo
import subjectRoutes from './routes/subjectRoutes'; // Import novo
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Registro de todas as APIs obrigatórias [cite: 95-99]
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', subjectRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Scholar_Net rodando na porta ${PORT}`);
});