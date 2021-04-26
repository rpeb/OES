const router = require("express").Router();
const passport = require("passport");
const { isAdmin } = require("../middlewares/auth");
const getStudent = require("../middlewares/getStudent");
const Exam = require("../models/exam");
const Answer = require("../models/answers");
const User = require("../models/user");
const LocalStorage = require("node-localstorage").LocalStorage;
const { hashSync } = require("bcrypt");
const localStorage = new LocalStorage("./scratch");
const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const config = require("config");
const nanoid = require("nanoid").customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  6
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get("mail.user"),
    pass: config.get("mail.pass") 
  }
})

// const adminRedirect = {
//   failureRedirect: "/login-failure",
//   successRedirect: "/admin/dashboard",
// };

// router.get("/login", (req, res) => {
//   res.render("admin/login");
// });

// // /admin/login

// router.post("/login", passport.authenticate("local", adminRedirect));

// router.get("/dashboard", isAdmin, (req, res) => {
//   res.render("admin/dashboard");
// });

// function stringToDate(dateString) {
//   let a = dateString.split("-");
//   return new Date(
//     a[0],
//     a[1] - 1,
//     new Date(a[0], a[1] - 1, a[2]).getDate() + 1,
//     05,
//     29
//   );
// }

// function timestringToDate(timeString, dateString) {
//   const a = timeString.split(":");
//   const b = dateString.split("-");
//   return new Date(b[0], b[1] - 1, b[2], a[0], a[1]);
// }

// router.get("/create-exam/exam-details", isAdmin, (req, res) => {
//   res.render("admin/createExam");
// });

// router.post("/create-exam/exam-details", isAdmin, async (req, res) => {
//   const fields = req.body;
//   const dateString = fields.exam_date;
//   fields.exam_date = stringToDate(fields.exam_date);
//   fields.start_time = timestringToDate(fields.start_time, dateString);
//   fields.end_time = timestringToDate(fields.end_time, dateString);
//   try {
//     const result = await Exam.updateOne(
//       { _id: localStorage.exam_id },
//       { $set: { exam_details: fields } }
//     );
//     res.send({
//       message: "Exam Details Added!",
//       data: localStorage.exam_id,
//       redirectionLink: "/student/dashboard",
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// });

router.post("/create-exam", isAdmin, getStudent, async (req, res) => {
  try {
    const data = req.body.worksheets;
    console.log("data", data);
    const student_data = Object.values(data[0])[0];
    
    const question_data = Object.values(data[1])[0];
    const num_questions = question_data.length;
    const { fields } = req.body;
    const dateString = fields.exam_date;
    fields.exam_date = stringToDate(fields.exam_date);
    fields.start_time = timestringToDate(fields.start_time, dateString);
    fields.end_time = timestringToDate(fields.end_time, dateString);
    // let result = [],
    //   ans = [],
    //   tmp = {};
    let ans = []
    for (var i = 0; i < num_questions; ++i) {
      let tmp = [];
      for (var j = 0; j < fields.num_options; ++j) {
        tmp.push(question_data[i][`option${j + 1}`]);
        delete question_data[i][`option${j + 1}`];
      }
      question_data[i].options = [...tmp];

      ans.push({
        qid: "-1",
        selectedOption: "-1",
        correct_option: question_data[i].correct_option,
        points: question_data[i].points,
      });
    }
    // tmp = {
    //   answers: ans,
    //   sid: "0",
    //   present: false,
    //   points_scored: 0,
    //   status: "Fail",
    // };
    // for (var i = 0; i < student_data.length; ++i) {
    //   result.push(tmp);
    // }
    // console.log(req.body.fields);

    let exam = new Exam({
      exam_details: fields,
      students: student_data,
      questions: question_data,
    });
    exam = await exam.save();

    for (var i = 0; i < student_data.length; ++i) {
      let answer = new Answer({
        email: student_data[i].email,
        eid: exam._id,
        sid: "0",
        answers: ans,
      });
      await answer.save();
    }

    res.redirect("/admin/dashboard");
    
    // adding students to user collection
    for (var i = 0; i < student_data.length; ++i) {
      let student = await User.findOne({email: student_data[i].email});
      if (!student) {
        let plainStudentPassword = nanoid();
        student = new User({
          email: student_data[i].email,
          password: hashSync(plainStudentPassword, 10),
          first_name: student_data[i].first_name,
          last_name: student_data[i].last_name,
          role: "student"
        })
        student = await student.save();
        await transporter.sendMail({
          from: "prakashdubey1999@gmail.com",
          to: student.email,
          subject: "New Exam Alert",
          html: `
            <h3> Here is your temporary password: ${plainStudentPassword} </h3> <br> <p>
              A new exam has been added. Login with this email and password to view details of examination.
            </p>
            `
        })
      } else {
        await transporter.sendMail({
          from: "prakashdubey1999@gmail.com",
          to: student.email,
          subject: "New Exam Alert",
          html: `
            <p>
              A new exam has been added. Login to view all your upcoming exams.
            </p>
            `
        })
      }
    }

    // adding teacher to user collection
    var plainTeacherPassword = nanoid();
    let teacher = await User.findOne({email: fields.tmail});
    if (!teacher) {
        teacher = new User({
        email: fields.tmail,
        password: hashSync(plainTeacherPassword, 10),
        first_name: "Hello",
        last_name: "Teacher",
        role: "teacher"
      })
      teacher = await teacher.save();
      await transporter.sendMail({
        from: "prakashdubey1999@gmail.com",
        to: teacher.email,
        subject: "Exam Created Successfully",
        html: `
          <h3> Here is your temporary password: ${plainTeacherPassword} </h3> <br> <p>
          Exam with name: ${fields.examination_name} and subject code: ${fields.subject_code} has been created. </h3> Login to see all upcoming exams.
          </p> `
      })
    } else {
      await transporter.sendMail({
        from: "prakashdubey1999@gmail.com",
        to: teacher.email,
        subject: "Exam Created",
        html: `
          <h3> Exam with name: ${fields.examination_name} and subject code: ${fields.subject_code} has been created. </h3> Login to see all upcoming exams.`
      })
    }
  } catch (err) {
    console.log(err);
  }
});

// router.get("/addStudent", (req, res) => {
//   res.render("admin/addStudent");
// });

// module.exports = router;

const adminRedirect = {
  failureRedirect: "/login-failure",
  successRedirect: "/admin/dashboard",
};

router.get("/login", (req, res) => {
  res.render("admin/login");
});
router.get("/logout",(req, res)=>{
  req.logout();
  res.redirect("login");
})

// /admin/login

router.post("/login", passport.authenticate("local", adminRedirect));

router.get("/dashboard", isAdmin, (req, res) => {
  res.render("admin/dashboard");
});

function stringToDate(dateString) {
  let a = dateString.split("-");
  return new Date(
    a[0],
    a[1] - 1,
    new Date(a[0], a[1] - 1, a[2]).getDate() + 1,
    05,
    29
  );
}

function timestringToDate(timeString, dateString) {
  const a = timeString.split(":");
  const b = dateString.split("-");
  return new Date(b[0], b[1] - 1, b[2], a[0], a[1]);
}

router.get("/create-exam/exam-details", isAdmin, (req, res) => {
  res.render("admin/createExam");
});

router.post("/create-exam/exam-details", isAdmin, async (req, res) => {
  const fields = req.body;
  const dateString = fields.exam_date;
  fields.exam_date = stringToDate(fields.exam_date);
  fields.start_time = timestringToDate(fields.start_time, dateString);
  fields.end_time = timestringToDate(fields.end_time, dateString);
  try {
    const result = await Exam.updateOne(
      { _id: localStorage.exam_id },
      { $set: { exam_details: fields } }
    );
    res.send({
      message: "Exam Details Added!",
      data: localStorage.exam_id,
      redirectionLink: "/student/dashboard",
    });
  } catch (err) {
    console.log(err.message);
  }
});

// router.post("/create-exam", isAdmin, getStudent, async (req, res) => {
//   try {
//     const data = req.body.worksheets;
//     const { fields } = req.body;
//     const dateString = fields.exam_date;
//     fields.exam_date = stringToDate(fields.exam_date);
//     fields.start_time = timestringToDate(fields.start_time, dateString);
//     fields.end_time = timestringToDate(fields.end_time, dateString);
//     const student_data = Object.values(data[0])[0];
//     const question_data = Object.values(data[1])[0];
//     const num_questions = question_data.length;

//     let ans = [];
//     for (var i = 0; i < num_questions; ++i) {
//       let tmp = [];
//       for (var j = 0; j < req.body.fields.num_options; ++j) {
//         tmp.push(question_data[i][`option${j + 1}`]);
//         delete question_data[i][`option${j + 1}`];
//       }
//       question_data[i].options = [...tmp];

//       ans.push({
//         qid: "-1",
//         selectedOption: "-1",
//         correct_option: question_data[i].correct_option,
//         points: question_data[i].points,
//       });
//     }

//     // console.log(req.body.fields);

//     const exam = new Exam({
//       exam_details: fields,
//       students: student_data,
//       questions: question_data,
//     });
//     const result = await exam.save();
//     // create an answer document with one object per question in the answer array
//     /*
//       {
//         "eid": result._id, "sid": "0", "answers": [{qid: "0", selectedOption: "0"}];
//       }
//     */
//     let answer = new Answer({
//       eid: result._id,
//       sid: "0",
//       answers: ans,
//     });
//     answer = answer.save();
//     localStorage.exam_id = result._id;
//     res.redirect("/commonLogin");
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
