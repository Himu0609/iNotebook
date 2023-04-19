const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { create, findOne } = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "HarHarMahaDev";
// create a user using :"/api/auth/createuser". no login req                    Route 1
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password ").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //   if errors return bad req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //  check if use exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this mail already eists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create A New User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);
// create a user using :"/api/auth/createuser". no login req             Route 2
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "Pass can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //   if errors return bad req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please Enter Right Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please Enter Right Credentials" });
      }
      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//  Get Logged in detail using :Post  Login req                        Route 3
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
    console.log(userId);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});
module.exports = router;
