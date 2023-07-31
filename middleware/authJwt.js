import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;

const verifyToken = (req, res, next) => {
  try {
    let token = req.session.token;

    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.userId);

    let roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isModerator = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.userId);

    let roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).json({ message: "Require Moderator Role!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.userId);

    let roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res
      .status(403)
      .json({ message: "Require Moderator or Admin Role!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
