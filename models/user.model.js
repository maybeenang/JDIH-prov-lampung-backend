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
    apikey: {
      type: Sequelize.STRING,
      nullable: true,
    },
    refreshToken: {
      type: Sequelize.STRING,
      nullable: true,
    },
  });

  return User;
};
