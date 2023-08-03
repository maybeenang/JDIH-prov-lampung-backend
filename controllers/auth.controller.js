import db from "../models/index.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import utils from "../helpers/utils.js";

dotenv.config();

const User = db.user;
const role = db.role;
const Op = db.Sequelize.Op;

const signUp = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Please fill all required fields" });
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bycrypt.hashSync(
        req.body.password + process.env.SALT_PASSWORD,
        8
      ),
      apikey: null,
      refreshToken: null,
    });

    const token = utils.generateApiKey(user.id, user.updatedAt);

    await user.update({ apikey: token });

    if (req.body.roles) {
      const roles = await role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      await user.setRoles(roles);
      res.send({ message: "User was registered successfully!" });
      return;
    } else {
      await user.setRoles([1]);
      res.send({ message: "User was registered successfully!" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(401).send({ message: "User Not found." });
    }

    const passwordIsValid = bycrypt.compareSync(
      req.body.password + process.env.SALT_PASSWORD,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS, {
      expiresIn: "1h", // 24 hours
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // 24 hours
    });

    await user.update({ refreshToken: refreshToken });

    const authorities = [];

    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    res.session.token = refreshToken;

    return res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
      },
      token: accessToken,
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

    let token = session.token;

    const user = await User.findOne({
      where: {
        refreshToken: token,
      },
    });

    if (!user) {
      return res.status(403).send({ message: "Forbidden" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || decoded.id !== user.id) {
        return res.status(403).send({ message: "Forbidden!" });
      }

      token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: "30s", // 24 hours
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    const session = req.session;

    if (!session.token) {
      return res.status(204);
    }

    const token = session.token;
    const user = await User.findOne({
      where: {
        refreshToken: token,
      },
    });

    if (!user) {
      res.session = null;
      return res.status(204);
    }

    await user.update({ refreshToken: null });
    return res.status(204);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export default { signUp, signIn, signOut, refreshToken };
