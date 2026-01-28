const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  if (req.user) {
    return next();
  }
  const token = req.cookies.token;
  if (!token) {
    console.log("no token");
    return res.json({ message: "Token Empty" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    console.log('verified');
    next();
  } catch (error) {
    console.log("error in auth middleware", error);
    return res.json({ error: error.message });
  }
};

module.exports = verifyUser;
