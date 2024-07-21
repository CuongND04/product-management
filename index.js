const express = require("express");
const path = require("path");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
require("dotenv").config();
const database = require("./config/database");
var moment = require("moment"); // chuyển Date thành giờ
const systemConfig = require("./config/system");

const { Server } = require("socket.io");
const http = require("http");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect(); // kết nối với db
const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Socket IO
const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Có 1 user kết nối");
});
// End SocketIO

//Flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//END Flash

// TinyCME
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// END TinyCME

// App local variable: sử dụng được ở all file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

app.locals.moment = moment;

routeAdmin(app);
route(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
