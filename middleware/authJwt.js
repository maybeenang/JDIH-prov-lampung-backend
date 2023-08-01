import jwt from "jsonwebtoken";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

const User = db.user;

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      let user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
    });

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export default { verifyToken, isAdmin };
