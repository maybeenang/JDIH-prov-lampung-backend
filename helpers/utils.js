import bycrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const generateApiKey = (id, updatedAt) => {
  return bycrypt.hashSync(
    id.toString() + updatedAt.toString() + process.env.SALT_APIKEY,
    8
  );
};

const decodeApiKey = (apikey, id, updatedAt) => {
  return bycrypt.compareSync(
    id.toString() + updatedAt.toString() + process.env.SALT_APIKEY,
    apikey
  );
};

export default { generateApiKey };
