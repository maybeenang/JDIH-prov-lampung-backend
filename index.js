import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";

import beritaRoutes from "./routes/berita.routes.js";
import artikelRoutes from "./routes/arikel.routes.js";
import monografiRoutes from "./routes/monografi.routes.js";
import galeryRoutes from "./routes/galery.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
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

// app.use("/auth", authRoutes);
app.use("/api/v1/berita", beritaRoutes);
app.use("/api/v1/artikel", artikelRoutes);
app.use("/api/v1/monografi", monografiRoutes);
app.use("/api/v1/galery", galeryRoutes);

app.use((req, res) => {
  res.status(404).send("<h1>404, Page Not Found!</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
