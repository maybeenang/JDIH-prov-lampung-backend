import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  token = token.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid Token" });
      }

      const userId = decoded.id;
      let user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      
      if (!user) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      next();
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
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
