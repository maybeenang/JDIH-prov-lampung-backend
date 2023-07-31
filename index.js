import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import db from "./models/index.js";

import { routes } from "./routes/index.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(cors());

app.use(json());

app.use(urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    // keys: [process.env.COOKIE_KEY],
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

app.get("/", (req, res) => {
  res.render("index");
});

const Role = db.role;

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//   initial();
// });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });
//   Role.create({
//     id: 2,
//     name: "moderator",
//   });
//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

routes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
