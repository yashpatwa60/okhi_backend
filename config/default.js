const dotenv = require('dotenv')
dotenv.config()

const config = {
  type: "P",
  db: {
    host_prod: "",
    host_dev: "",
    db: "",
    port: "",
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    uri: ``
  },
  files: {
    path: "http://localhost:3498/uploads/",
    avatar: "avatar/",
    basepath: "http://localhost:3498/",
  },
};

module.exports = config