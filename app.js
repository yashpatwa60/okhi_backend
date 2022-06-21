const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const history = require("connect-history-api-fallback");
const config = require('./config/default')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json());

const ALLOWED_DOMAINS = [
  "https://okhi.in",
  "https://www.okhi.in",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:3000",
  "http://localhost:3498",
  "https://okhi-node-server.herokuapp.com",
];

// const CSP_ALLOWED_DOMAINS = [
// 	'https://*.teachomatrix.com',
// 	// 'http://localhost:8080'
// ]

//Using helmet
app.use(
  helmet.referrerPolicy({
    policy: "no-referrer",
  })
);

app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hsts());
// app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());

//CSP Header
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", ...CSP_ALLOWED_DOMAINS],
//       scriptSrc: ["'self'", ...CSP_ALLOWED_DOMAINS],
//       objectSrc: ["'self'", ...CSP_ALLOWED_DOMAINS],
//       frameSrc: ["'self'", ...CSP_ALLOWED_DOMAINS],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

//Using the cors headers to allow only from the request
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (ALLOWED_DOMAINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

//Route handlers

const user_route = require("./routes/user");
const auth_route = require("./routes/auth");
const bgtheme_route = require("./routes/bgtheme");

//Limiting the rate for API
const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
//Routes
app.use("/api/user", user_route);
app.use("/api/auth", auth_route);
app.use("/api/bgtheme", bgtheme_route);

// 1st call for unredirected requests
app.use(express.static(path.join(__dirname + "/build")));
// Support history api
app.use(history());
// 2nd call for redirected requests
app.use(express.static(path.join(__dirname + "/build")));

//Mongoose
const MONGO_USERNAME = config.db.username
const MONGO_PASSWORD = config.db.password
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.get('/', (req, res) => {
	res.send("Welcome to OKHI server")
})

let mongoURL =
  `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.ukhrs.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(`Error in connecting to database ${err}`);
  });;

//Setting up WebServer
const port = process.env.PORT || 3498;
const server = app.listen(port, async () => {
  console.log(`Running on Port ${port}`);
});
