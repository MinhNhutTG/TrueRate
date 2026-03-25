require("dotenv").config();

const cookieParser = require("cookie-parser");
const database = require("./config/configDatabase");
const route = require("./routes/client/route");
const express = require("express");
const path = require("path");

const { attachUser } = require('./middleware/auth.middleware')
const authRouter = require('./routes/client/auth.router')
const app = express();
const PORT = process.env.PORT || 3000;

// set pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware gắn user vào res.locals
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(`${__dirname}/public`));

// Gắn user vào res.locals cho mọi request (dùng trong layout/header)
app.use(attachUser)

 


app.use("/", authRouter);
route(app);

// ✅ START SERVER SAU KHI CONNECT DB
async function startServer() {
  try {
    await database.connect(); // ⚠️ ĐỢI CONNECT
    console.log("✅ DB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Connect to database error:", error.message);
    process.exit(1);
  }
}

startServer();