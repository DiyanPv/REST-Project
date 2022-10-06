const jwt = require(`jsonwebtoken`);

module.exports = (req, res, next) => {
  const token = req.get(`Authorization`).split(` `)[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify;
  } catch {}
};
