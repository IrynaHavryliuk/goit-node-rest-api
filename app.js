import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";

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

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});

app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
});
