import db from "../models/index.js";
import bycrypt from "bcryptjs";

const User = db.user;
const role = db.role;
const Op = db.Sequelize.Op;

const signUp = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bycrypt.hashSync(req.body.password, 8),
    });

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
    }

    await user.setRoles([1]);
    res.send({ message: "User was registered successfully!" });
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
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bycrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;

    const authorities = [];

    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    req.session.destroy();
    res.send({ message: "User was logged out successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export default { signUp, signIn, signOut };
