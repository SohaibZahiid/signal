const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Please provide token");
  }
  try {
    token = token.split(" ")[1]
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified
    next();
  } catch (error) {
    res.status(400).json(error.message)
  }

};

module.exports = verifyToken;
