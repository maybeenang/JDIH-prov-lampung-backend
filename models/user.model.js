import { Sequelize } from "sequelize";

export default (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
