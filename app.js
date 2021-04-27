//   Authors: 
//   Ria Rupini, 
//   Maitri Majumder, 
//   Ria Paul, 
//   Prakash Dubey 

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan"),
  mongoose = require("mongoose"),
  config = require('config'),
  passport = require('passport')
  indexRoutes = require('./routes/index'),
  session = require('express-session'),
  mongoStore = require('connect-mongo'),
  adminRoutes = require('./routes/admin'),
  studentRoutes = require('./routes/student'),
  examRoutes = require('./routes/exam'),
  teacherRoutes = require('./routes/teacher')

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

global.appRoot = __dirname;

app.use(session({
  secret: config.get('session_secret'),
  saveUninitialized: true,
  resave: false,
  store: mongoStore.create({mongoUrl: config.get('dbString')}),
  cookie: {
    maxAge: 24*60*60*1000
  }
}))

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// app.use((req,res,next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// })

app.use('/',indexRoutes)
app.use('/admin', adminRoutes)
app.use('/student', studentRoutes)
app.use('/exam', examRoutes)
app.use('/teacher', teacherRoutes)

mongoose
  .connect(config.get("dbString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to Database.."))
  .catch((err) => console.log("Error", err.message));


app.listen(5000, () => console.log("Listening on port 5000..."));

module.exports = app;
