const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require(`mongoose`);
const path = require(`path`);
const feedRoutes = require("./routes/posts");
const authroutes = require("./routes/auth");
const { v4: uuidv4 } = require("uuid");
const socketio = require(`socket.io`);
const multer = require(`multer`);
const app = express();
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: "./images/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == `image/png` ||
    file.mimetype == `image/jpg` ||
    file.mimetype == `image/jpeg`
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Headers", `Content-Type, Authorization`);
  next();
});
app.use(multer({ storage: storage, fileFilter: fileFilter }).single(`image`));
/// VERY IMPORTANT -->  const imageUrl = req.file.path.replace("\\" ,"/");

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json(message);
});
app.use("/feed", feedRoutes);
app.use("/auth", authroutes);
mongoose
  .connect(`mongodb+srv://peter:88888888@cluster.4rlz1th.mongodb.net/messages`)
  .then((result) => {
    console.log(`connected`);
    const server = app.listen(8080);
    socketio(server);
    const io = require("./middleware/socket").init(server);

  })
  .catch((err) => console.log(err));
