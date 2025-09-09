const path = require("path");
console.log("Dir name", path.join(__dirname));
console.log("file name", path.join(__filename));
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes");

const app = express();
const PORT = process.env.PORT || 3000;

//Connect to DB
connectToDB();

//Middleware
// app.use((req, res, next) => {
//   if(req.is("multipart/form-data")){
//     return next();
//   };
//   return express.json()(req, res, next);
// })

app.use("/api/auth", express.json(), authRoutes);
app.use("/api/home", express.json(), homeRoutes);
app.use("/api/admin", express.json(), adminRoutes);
app.use("/api/image", uploadImageRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
