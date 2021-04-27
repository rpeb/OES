/* 
  Authors: 
  Ria Rupini, 
  Maitri Majumder, 
  Ria Paul, 
  Prakash Dubey 
*/

const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    eid: String,
    sid: String,
    email: {type: String},
    present: {type: Boolean, default: false},
    answers: [
        {
            qid: String,
            selectedOption: String,
            correct: {type: Boolean, default: false},
            correct_option: String,
            points: Number
        }
    ],
    points_scored: {type: Number, default: 0},
    status: {type: String, default: "Fail"}
})

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;

// {
//     "eid": "1",
//     "sid": "2",
//     answers: [
//         qid: "-1",
//         selectedOption: "-1"
//     ]
// }

// {
//     "eid": "1",
//     "sid": "0",
//     answers: [
//         qid: "-1",
//         selectedOption: "-1"
//     ]
// }