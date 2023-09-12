import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";

import beritaRoutes from "./routes/berita.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// dbInit();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "gatau",
    secret: process.env.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
);

app.use("/auth", authRoutes);
app.use("/v1/api/berita", beritaRoutes);

app.use((req, res) => {
  res.status(404).send("<h1>404, Page Not Found!</h1>");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
