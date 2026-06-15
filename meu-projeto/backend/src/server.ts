
import express from 'express';
import cors from 'cors';
import { setupDatabase } from './database/index'; 
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes'; 
import subjectRoutes from './routes/subjectRoutes'; 
import authRoutes from './routes/authRoutes';
import gradeRoutes from './routes/gradeRoutes';
import cursoRoutes from './routes/CursoRoutes';


const app = express();

app.use(cors());
app.use(express.json());

// Registro das APIs
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', subjectRoutes);
app.use('/api', authRoutes);
app.use('/api', gradeRoutes);
app.use('/api', cursoRoutes);

const PORT = process.env.PORT || 3000;

// Função para ligar o servidor apenas após o banco estar pronto
async function startServer() {
  try {
    
    await setupDatabase(); 

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Scholar_Net rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Falha crítica ao iniciar servidor:", error);
  }
}

startServer();