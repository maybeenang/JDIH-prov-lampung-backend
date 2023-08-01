import db from "../models/index.js";

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400);
    }

    let user = await User.findOne({ where: { username: username } });

    if (user) {
      return res.status(400).send({ message: "Username is already taken!" });
    }

    user = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(400).send({ message: "Email is already in use!" });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  try {
    let { roles } = req.body;

    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        if (!ROLES.includes(roles[i])) {
          return res.status(400).send({
            message: `Failed! Role ${roles[i]} does not exist!`,
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export default { checkDuplicateUsernameOrEmail, checkRolesExisted };
