import {
  DB,
  USER,
  PASSWORD,
  HOST,
  dialect as _dialect,
  pool as _pool,
} from "../config/db.config.js";

import Sequelize from "sequelize";
import { userModel } from "./user.model.js";
import { roleModel } from "./role.model.js";

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: _dialect,
  // operatorsAliases: false,
  pool: {
    max: _pool.max,
    min: _pool.min,
    acquire: _pool.acquire,
    idle: _pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

export default db;
