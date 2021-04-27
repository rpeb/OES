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
const Exam = require("../models/exam");
const { schemas, validateInput } = require("../middlewares/inputValidator");
const { isStudent } = require("../middlewares/auth");

const passportRedirect = {
  failureRedirect: "/login-failure",
  successRedirect: "/student/home",
};

router.post("/login", passport.authenticate("local", passportRedirect));

router.post(
  "/register",
  validateInput(schemas.newUser, "body"),
  async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const hashedPassword = await bcrypt.hashSync(password, 10);
      const user = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: "student",
      });
      const result = await user.save();
      res.redirect("/student/login");
    } catch (err) {
      console.log("Error", err.message);
    }
  }
);

router.get("/", (req, res, next) => {
  res.redirect("/student/login");
});

router.get("/login", (req, res, next) => {
  res.render("student/login");
});

router.get("/register", (req, res, next) => {
  res.render("student/register");
});

router.get("/dashboard", isStudent, async (req, res) => {
  try {
    const exams = await Exam.find({
      "exam_details.exam_date": { $gte: Date.now().toString() },
    }).find({ students: { $elemMatch: { email: req.user.email } } });
    let student = req.user;
    let student_id = student._id;
    let student_name = student.first_name;
    if (!student.last_name) student_name = student_name;
    else student_name += " " + student.last_name;
    console.log("student name", student_name);
    const fields = Object.keys(exams[0]["exam_details"]);
    let idx = fields.indexOf("$init");
    if (idx > -1) fields.splice(idx, 1);
    idx = fields.indexOf("num_options");
    if (idx > -1) fields.splice(idx, 1);
    idx = fields.indexOf("subject_code");
    if (idx > -1) fields[idx] = "subject code";
    idx = fields.indexOf("examination_name");
    if (idx > -1) fields[idx] = "Name of Exam";
    idx = fields.indexOf("exam_date");
    if (idx > -1) fields[idx] = "Exam Date";
    idx = fields.indexOf("start_time");
    if (idx > -1) fields[idx] = "Starts At";
    idx = fields.indexOf("end_time");
    if (idx > -1) fields[idx] = "Ends At";
    idx = fields.indexOf("tmail");
    if (idx > -1) fields[idx] = "Teacher's email";
    idx = fields.indexOf("total_marks");
    if (idx > -1) fields[idx] = "Total Marks";
    idx = fields.indexOf("passing_marks");
    if (idx > -1) fields[idx] = "Passing marks";
    // delete fields['num_options'];

    let examData = [];
    for (var i = 0; i < exams.length; ++i) {
      // removing "$init"
      let exam = Object.values(exams[i]["exam_details"]).splice(1);
      // removing "num_options"
      exam.splice(7, 1);
      let id = exams[i]._id;

      // formatting exam_date
      let exam_date =
        exam[2].getDate() +
        "/" +
        (exam[2].getMonth() + 1) +
        "/" +
        exam[2].getFullYear();
      exam[2] = exam_date;

      // formatting start_time and end_time
      let start_time_hour =
        exam[3].getHours() < 10 ? "0" + exam[3].getHours() : exam[3].getHours();
      let start_time_mins =
        exam[3].getMinutes() < 10
          ? "0" + exam[3].getMinutes()
          : exam[3].getMinutes();
      exam[3] = start_time_hour + ":" + start_time_mins;

      let end_time_hour =
        exam[4].getHours() < 10 ? "0" + exam[4].getHours() : exam[4].getHours();
      let end_time_mins =
        exam[4].getMinutes() < 10
          ? "0" + exam[4].getMinutes()
          : exam[4].getMinutes();
      exam[4] = end_time_hour + ":" + end_time_mins;
      examData.push({ exam: exam, _id: id });
    }
    // console.log(examData);
    res.render("student/dashboard", {
      student_id,
      student_name,
      fields,
      examData,
      num_exams: exams.length
    });
  } catch (err) {
    console.log(err.message);
    res.render("student/noExam");
  }
});

router.get("/pastExams", async (req, res) => {
  try {
    const exams = await Exam.find({
      "exam_details.exam_date": { $lt: Date.now().toString() },
    }).find({ students: { $elemMatch: { email: req.user.email } } });
    let student = await User.findOne({ email: req.user.email });
    let student_id = student._id;
    let student_name = student.first_name + " " + student.last_name;
    const fields = Object.keys(exams[0]["exam_details"]);
    let idx = fields.indexOf("$init");
    if (idx > -1) fields.splice(idx, 1);
    idx = fields.indexOf("num_options");
    if (idx > -1) fields.splice(idx, 1);
    idx = fields.indexOf("subject_code");
    if (idx > -1) fields[idx] = "subject code";
    idx = fields.indexOf("examination_name");
    if (idx > -1) fields[idx] = "Name of Exam";
    idx = fields.indexOf("exam_date");
    if (idx > -1) fields[idx] = "Exam Date";
    idx = fields.indexOf("start_time");
    if (idx > -1) fields[idx] = "Starts At";
    idx = fields.indexOf("end_time");
    if (idx > -1) fields[idx] = "Ends At";
    idx = fields.indexOf("tmail");
    if (idx > -1) fields[idx] = "Teacher's email";
    idx = fields.indexOf("total_marks");
    if (idx > -1) fields[idx] = "Total Marks";
    idx = fields.indexOf("passing_marks");
    if (idx > -1) fields[idx] = "Passing marks";
    // delete fields['num_options'];

    let examData = [];
    for (var i = 0; i < exams.length; ++i) {
      // removing "$init"
      let exam = Object.values(exams[i]["exam_details"]).splice(1);
      // removing "num_options"
      exam.splice(7, 1);
      let id = exams[i]._id;

      // formatting exam_date
      let exam_date =
        exam[2].getDate() +
        "/" +
        (exam[2].getMonth() + 1) +
        "/" +
        exam[2].getFullYear();
      exam[2] = exam_date;

      // formatting start_time and end_time
      let start_time_hour =
        exam[3].getHours() < 10 ? "0" + exam[3].getHours() : exam[3].getHours();
      let start_time_mins =
        exam[3].getMinutes() < 10
          ? "0" + exam[3].getMinutes()
          : exam[3].getMinutes();
      exam[3] = start_time_hour + ":" + start_time_mins;

      let end_time_hour =
        exam[4].getHours() < 10 ? "0" + exam[4].getHours() : exam[4].getHours();
      let end_time_mins =
        exam[4].getMinutes() < 10
          ? "0" + exam[4].getMinutes()
          : exam[4].getMinutes();
      exam[4] = end_time_hour + ":" + end_time_mins;
      examData.push({ exam: exam, _id: id });
    }
    // console.log(examData);
    res.render("student/pastExams", {
      student_id,
      student_name,
      fields,
      examData,
      num_exams: exams.length
    });
  } catch (err) {
    console.log(err.message);
    res.render("student/noExam");
  }
})

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("login");
});

router.get("/home", isStudent, (req, res, next) => {
  res.render("student/studentArea", {
    name: req.user.first_name
  });
});

router.get("/login-success", (req, res, next) => {
  res.redirect("student/home");
  // res.render("student/studentArea");
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
