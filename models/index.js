import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  logging: false,
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

import User from "./user.model.js";
import Role from "./role.model.js";
import Berita from "./berita.model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = User(sequelize, Sequelize);
db.role = Role(sequelize, Sequelize);
db.berita = Berita(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "admin"];

export const dbInit = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully");

    const Role = db.role;
    await db.sequelize.sync({ force: true });
    await Role.create({
      id: 1,
      name: "user",
    });
    await Role.create({
      id: 2,
      name: "admin",
    });

    console.log("Drop and re-sync db.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

export default db;
