const publicAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userAccess = (req, res) => {
  res.status(200).send("User Content.");
};

const adminAccess = (req, res) => {
  res.status(200).send("Admin Content.");
};

export default { publicAccess, userAccess, adminAccess };
