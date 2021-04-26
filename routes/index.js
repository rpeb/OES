const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require('../models/user')
const {isAuth, isAdmin} = require('../middlewares/auth');

const passportRedirect = {
    failureRedirect: '/login-failure', 
    successRedirect: '/login-success'
}

router.post("/login", passport.authenticate('local', passportRedirect));

// /

router.post("/register", async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    // console.log(hashedPassword);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
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

router.get("/commonLogin", (req, res, next)=>{
  res.render("commonLogin");
});

router.get("/login", (req, res, next) => {
  res.redirect('/commonLogin');
});

router.get("/register", (req, res, next) => {
  res.redirect('/commonLogin')
});

router.get("/protected-route", isAuth, (req, res, next) => {
    res.send('Welcome to protected route!')
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get('/admin-route', isAdmin, (req,res,next) => {
    res.send('Welcome to the admin route!')
})

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
