import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from './routes/authRoutes.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
    console.error("DB_URI not defined in the environment variables.");
    process.exit(1);
}

mongoose.connect(DB_URI)
    .then(() => console.log("Database connection successful. Connected to MongoDB."))
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
});
