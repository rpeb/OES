const router = require("express").Router();
const { isStudent, isAuth } = require("../middlewares/auth");
const Exam = require("../models/exam");
const Answer = require("../models/answers");

router.get("/:examid/:sid", isStudent, async (req, res) => {
  try {
    const eid = req.params.examid;
    const sid = req.params.sid;
    const exam = await Exam.findById(eid);
    const exam_details = exam.exam_details;

    // Duration
    const distance =
      new Date(exam_details.end_time).getTime() -
      new Date(exam_details.start_time).getTime();

    var duration_hrs = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var duration_min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var duration_sec = Math.floor((distance % (1000 * 60)) / 1000);

    if (duration_min < 10) duration_min = "0" + duration_min;
    if (duration_sec < 10) duration_sec = "0" + duration_sec;
    if (duration_hrs < 10) duration_hrs = "0" + duration_hrs;

    const duration = { duration_hrs, duration_min, duration_sec };
    res.render("exam/landing", { eid, sid, exam_details, duration });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:examid/:sid/start", isStudent, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examid);
    const num_questions = exam.questions.length;
    const { num_options } = exam.exam_details;
    const q_zero_id = exam.questions[0]._id.toString();
    const exam_details = exam.exam_details;

    const answer_doc = await Answer.findOne({eid: req.params.examid, email: req.user.email});
    answer_doc.present=true;
    answer_doc.sid=req.params.sid;
    await answer_doc.save();

    // Duration
    const distance =
      new Date(exam_details.end_time).getTime() -
      new Date(exam_details.start_time).getTime();

    var duration_hrs = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var duration_min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var duration_sec = Math.floor((distance % (1000 * 60)) / 1000);

    if (duration_min < 10) duration_min = "0" + duration_min;
    if (duration_sec < 10) duration_sec = "0" + duration_sec;
    if (duration_hrs < 10) duration_hrs = "0" + duration_hrs;
    

    res.render("exam/exampage", {
      num_questions,
      name: req.user.first_name,
      sid: req.params.sid,
      eid: req.params.examid,
      num_options,
      qid: q_zero_id,
      duration_hrs,
      duration_min,
      duration_sec,
      exam,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:examid/:sid/getResult", isAuth, async (req, res) => {
  try {
    const answer_doc = await Answer.findOne({ eid: req.params.examid, sid: req.params.sid });
    
    const { answers } = answer_doc;
    const answers_len = answers.length;
    const exam = await Exam.findById(req.params.examid);
    let total_points = 0;
    for (var i = 0; i < answers_len; ++i) {
      if (answers[i].selectedOption === answers[i].correct_option) {
        total_points += answers[i].points;
      }
    }
    res.render("exam/displayResult", {
      answers,
      num_answers: answers_len,
      eid: req.params.examid,
      exam_name: exam.exam_details.examination_name,
      sid: req.params.sid,
      questions: exam.questions,
      total_points,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:examid/:sid/:question", isStudent, async (req, res) => {
  try {
    const q = req.params.question;
    const exam = await Exam.findById(req.params.examid);
    const question = exam.questions[q - 1];
    let answer = await Answer.findOne({ eid: req.params.examid, sid: req.params.sid });
    res.send({
      data: question,
      selectedOption: answer.answers[q - 1].selectedOption,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/:examid/:sid/", async (req, res) => {
  try {
    const { qid, selectedOption, counter } = req.body;
    let answer_doc = await Answer.findOne({ eid: req.params.examid, sid: req.params.sid });
    
    answer_doc.answers[counter - 1].qid = qid ;
    answer_doc.answers[counter - 1].selectedOption = selectedOption;
    
    await answer_doc.save();
    res.json({ status: "success", message: "Answer saved!" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

router.post("/submit/:examid/:sid/", async (req, res) => {
  try {
    const { qid, selectedOption, counter } = req.body;
    let answer_doc = await Answer.findOne({ eid: req.params.examid, sid: req.params.sid });
    
    answer_doc.answers[counter - 1].qid = qid;
    answer_doc.answers[counter - 1].selectedOption = selectedOption;
    const exam = await Exam.findById(req.params.examid);
    if (selectedOption === exam.questions[counter - 1].correct_option) {
      answer_doc.answers[counter - 1].correct = true;
    }
    const mapper = { a: 0, b: 1, c: 2, d: 3 };
    const answers = answer_doc.answers,
      questions = exam.questions;
    for (var i = 0; i < answers.length; ++i) {
      answers[i].correct_option =
        questions[i].options[mapper[questions[i].correct_option]];
      answers[i].selectedOption =
        questions[i].options[mapper[answers[i].selectedOption]];
    }
    let points_scored=0, total_points=0;
    for (var i = 0; i < answers.length; ++i) {
      if (answers[i].selectedOption === answers[i].correct_option) {
        points_scored += answers[i].points;
      }
      total_points += answers[i].points;
    }
    answer_doc.points_scored = points_scored;
    answer_doc.status = ((points_scored/total_points)*100 < 40) ? "Fail": "Pass";
    await answer_doc.save();
    res.json({ status: "success", message: "Exam Submitted Successfully! You can view result in the dashboard after exam time.. Click 'OK' to go to homepage" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

module.exports = router;


