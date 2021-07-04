const jwt = require("jsonwebtoken");

module.exports = {
  getTokenFromHeader: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
  verifyJwtToken: (req, res, next) => {
    let token;
    if ("authorization" in req.headers) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(403).send({ status: 403, auth: false, message: "Not Authorized to access this resource!" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send({ status: 500, auth: false, message: "Not Authorized to access this resource!" });

      req.jwtUserId = decoded._id;
      req.jwtExpireTime = decoded.exp;
      console.log("::request header :::", req.headers);
      if ("refreshtoken" in req.headers) {
        const newToken = jwt.sign({ _id: req.jwtUserId }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        });
        req.responseBody = { token: newToken };
      } else {
        req.responseBody = {};
      }
      next();
    });
  },
};
