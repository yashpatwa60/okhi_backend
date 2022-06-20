const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

//Logging in users
router.post("/", async (req, res) => {
  let email = req.body.email.toLowerCase();

  // Only active users
  let user = await User.findOne({
    email,
    is_approved: false,
    status: true,
  });

  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  const userToken = user.generateAuthToken()

  let send_obj = { name : user.name, type : user.type, token : userToken }
  
  return res.send(send_obj);
});

module.exports = router;
