const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Exam = require("../models/exam");
const Answer = require("../models/answers");
const { isTeacher } = require("../middlewares/auth");
const { route } = require("./exam");

const passportRedirect = {
  failureRedirect: "/login-failure",
  successRedirect: "/teacher/home",
};

router.get("/register", (req, res) => {
  res.render("teacher/register");
});

router.get("/", (req, res) => {
  res.redirect("/teacher/home");
});

router.get("/login", (req, res) => {
  res.render("teacher/login");
});
router.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("login");
})

router.post("/login", passport.authenticate("local", passportRedirect));

router.get("/home", isTeacher, (req, res, next) => {
  //   console.log(req.user);
  res.render("teacher/teacherArea");
});

router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "teacher",
    });
    const result = await user.save();
    res.redirect("/teacher/login");
  } catch (err) {
    console.log("Error", err.message);
  }
});

router.get("/upcomingExams", isTeacher, async (req, res) => {
  try {
    // find an upcoming exam for this teacher
    const exams = await Exam.find({
      "exam_details.exam_date": { $gte: Date.now().toString() },
      "exam_details.tmail": req.user.email,
    });
    let teacher_id = req.user._id;
    let teacher_name = req.user.first_name + " " + req.user.last_name;
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
    res.render("teacher/upcomingExams", {
      title: "Teacher - Upcoming Exams",
      teacher_id,
      teacher_name,
      fields,
      examData,
    });
  } catch (err) {
    console.log(err.message);
    res.render("student/noExam");
  }
});

router.get("/pastExams", isTeacher, async (req, res) => {
  try {
    const exams = await Exam.find({
      "exam_details.exam_date": { $lt: Date.now().toString() },
      "exam_details.tmail": req.user.email,
    });
    // console.log("Hello", exams);
    let teacher_id = req.user._id;
    let teacher_name = req.user.first_name + " " + req.user.last_name;
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
    if (idx > -1) fields[idx] = "Started";
    idx = fields.indexOf("end_time");
    if (idx > -1) fields[idx] = "Ended";
    idx = fields.indexOf("total_marks");
    if (idx > -1) fields[idx] = "Total Marks";
    idx = fields.indexOf("passing_marks");
    if (idx > -1) fields[idx] = "Passing marks";
    idx = fields.indexOf("tmail");
    if (idx > -1) fields.splice(idx, 1);
    // delete fields['num_options'];

    let examData = [];
    for (var i = 0; i < exams.length; ++i) {
      // removing "$init"
      let exam = Object.values(exams[i]["exam_details"]).splice(1);
      // removing "num_options"
      //   console.log(exam);
      exam.splice(7, 1);
      exam.splice(8, 1);
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
    res.render("teacher/pastExams", {
      title: "Teacher - Past Exams",
      teacher_id,
      teacher_name,
      fields,
      examData,
    });
  } catch (err) {
    console.log(err.message);
    res.render("student/noExam");
  }
});

router.get("/pastExams/:eid/results", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.eid);
    const exam_name = exam.exam_details.examination_name;
    const answer_doc = await Answer.find({eid: req.params.eid});
    const students = exam.students;
    let student_fields = [
      "s.no",
      "student name",
      "email",
      "present",
      "points_scored",
      "status",
      "details",
    ];
    // console.log("answer_docs", answer_docs);
    res.render("teacher/pastExamResult", {
      student_fields,
      students,
      answer_doc,
      exam_name,
      title: req.params.eid + "- Result",
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/pastExams/:eid/results/:sid", async (req, res) => {
  try {
    var {eid,sid} = req.params;
    if (sid == 0) {
      res.status(404).send('Resource not found!');
    }
    // const answer_doc = await Answer.findOne({
    //   eid: req.params.eid,
    //   sid: req.params.sid,
    // });
    // const students = exam.students;
    // console.log(answer_doc);
    // let student_fields = [
    //   "s.no",
    //   "student name",
    //   "email",
    //   "points_scored",
    //   "status",
    //   "details",
    // ];
    // console.log("hello from result i");
    // res.render("teacher/exam_i_Result", {
    //   student_fields,
    //   students,
    //   title: req.params.eid + "- Result",
    // });
    res.redirect(`/exam/${eid}/${sid}/getResult`);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
