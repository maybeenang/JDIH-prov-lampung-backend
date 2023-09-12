import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const signUp = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Please fill all required fields" });
    }

    const { username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const salt = bycrypt.genSaltSync(10);
    const hash = bycrypt.hashSync(password + process.env.SALT_PASSWORD, salt);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hash,
      },
    });

    if (!user) {
      return res.status(500).send({ message: "Internal Server Error" });
    }

    return res.status(201).send({
      message: "User was registered successfully!",
    });


  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    console.log("dasdadsasdasd");
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Please fill all required fields" });
    }

    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    const passwordIsValid = bycrypt.compareSync(
      password + process.env.SALT_PASSWORD,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // 24 hours
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // 30 days
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });


    req.session.token = refreshToken;

    return res.status(200).send({
      massage: "Login Success",
      accessToken: token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const session = req.session;

    if (!session.token) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const token = session.token;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid Token" });
      }

      const userId = decoded.id;

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      })

      if (!user) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      const refreshToken = user.refreshToken;

      if (!refreshToken) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.status(403).send({ message: "Invalid Token" });
          }

          const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h", // 24 hours
            }
          );

          const newRefreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d", // 30 days
            }
          );

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              refreshToken: newRefreshToken,
            },
          });

          return res.status(200).send({
            massage: "Login Success",
            accessToken: accessToken,
          });
        }
      );
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    const token = req.session.token;

    if (!token) {
      return res.status(400).send({ message: "Token not found" });
    }

    // eslint-disable-next-line no-undef
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const userId = decoded.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });

      req.session = null;
      return res.status(200).send({ message: "Logout berhasil!" });

    });



  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export default { signUp, signIn, signOut, refreshToken };
