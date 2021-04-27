/*
    Authors: 
    Ria Rupini, 
    Maitri Majumder, 
    Ria Paul, 
    Prakash Dubey
*/


const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { isAuth, isAdmin } = require("../middlewares/auth");
const crypto = require("crypto");
const config = require("config");
const nodemailer = require("nodemailer");

const passportRedirect = {
  failureRedirect: "/login-failure",
  successRedirect: "/login-success",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get("mail.user"),
    pass: config.get("mail.pass"),
  },
});

const url = {
  local: "http://localhost:5000",
  remote: "https://oes-trial.herokuapp.com"
}

router.post("/login", passport.authenticate("local", passportRedirect));

// /

router.get("/reset-password", (req, res) => {
  res.render("reset_password");
});

router.get("/reset/:token", (req, res) => {
  res.render("update_password", {
    token: req.params.token,
  });
});

router.post("/update-password", async (req, res) => {
  try {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    const user = await User.findOne({
      resetPasswordToken: sentToken,
      tokenExpiredIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(422).json({ error: "Token expired. Try Again" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.tokenExpiredIn = undefined;
    const result = await user.save();
    res.json({ message: "password updated successfully.." });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(422)
        .send({ error: "No user with that email exists in the system!" });
    }
    user.resetPasswordToken = token;
    user.tokenExpiredIn = Date.now() + 60 * 60 * 1000; // 1 hour
    const result = await user.save();
    await transporter.sendMail({
      to: user.email,
      from: config.get("mail.user"),
      subject: "Password-Reset OES",
      html: `
      <p>You requested for password reset.</p>
      <h5>Click on this <a href="${url.local}/reset/${token}">link</a> to reset password. This token is valid only for 1 hours.</h5>
      `,
    });
    res.json({ message: "check your email" });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    // console.log(hashedPassword);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await user.save();
    console.log(result);
    res.redirect("/login");
  } catch (err) {
    console.log("Error", err.message);
  }
});

router.get("/", (req, res, next) => {
  // res.send('<h1>Home</h1><p>Please <a href="/student/register">register as student</a></p><p>Please <a href="/student/login">login as student</a></p>');
  res.render("homePage");
});

router.get("/commonLogin", (req, res, next) => {
  res.render("commonLogin");
});

router.get("/login", (req, res, next) => {
  res.redirect("/commonLogin");
});

router.get("/register", (req, res, next) => {
  res.redirect("/commonLogin");
});

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("Welcome to protected route!");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("Welcome to the admin route!");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
