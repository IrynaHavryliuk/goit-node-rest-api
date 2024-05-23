import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from './routes/authRoutes.js';

// Перевірка наявності змінної оточення для підключення до бази даних
const DB_URI = process.env.DB_URI;
if (!DB_URI) {
    console.error("DB_URI not defined in the environment variables.");
    process.exit(1);
}

// Підключення до MongoDB з використанням async/await
(async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connection successful. Connected to MongoDB.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
})();

const app = express();

// Middleware для логування HTTP запитів
app.use(morgan("tiny"));
// Middleware для крос-доменних запитів
app.use(cors());
// Middleware для парсингу JSON вхідних запитів
app.use(express.json());

// Маршрути для роботи з контактами
app.use('/api/contacts', contactsRouter);
// Маршрути для аутентифікації
app.use('/api/users', authRouter);

// Обробка запитів на неіснуючі маршрути
app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Обробка помилок
app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
