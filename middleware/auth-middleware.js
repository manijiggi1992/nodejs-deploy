const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader", authHeader); //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGI3MTFmMGQ4YzczNTIxYmUzNDNlYjkiLCJ1c2VybmFtZSI6InNpdmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTY4OTk5MDEsImV4cCI6MTc1NjkwMTcwMX0.8qRE1jHy98q_xpeu670g5bTXpZqjC5MnyLXCCf78ikY
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
    });
  }

  //decode this token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);
    // {
    //   userId: '68b711f0d8c73521be343eb9',
    //   username: 'siva',
    //   role: 'admin',
    //   iat: 1756899901,
    //   exp: 1756901701
    // }

    req.userInfo = decodedTokenInfo;
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
    });
  }
};

module.exports = authMiddleware;
