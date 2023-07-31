import db from "../models/index.js";
import config from "../config/auth.config.js";
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

import jwt from "jsonwebtoken";
import pkg from "bcryptjs";
const { hashSync, compareSync } = pkg;

export async function signup(req, res) {
  try {
    // Save User to Database
    let user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashSync(req.body.password, 8),
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      const result = await user.setRoles(roles);
    } else {
      // user role = 1
      const result = await user.setRoles([1]);
    }
    res.status(200).json({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function signin(req, res) {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    const passwordIsValid = await compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];

    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function signout(req, res, next) {
  try {
    req.session.destroy();
    res.status(200).json({ message: "Signout successfully!" });
  } catch (error) {
    next(error);
  }
}
