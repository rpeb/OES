/* 
  Authors: 
  Ria Rupini, 
  Maitri Majumder, 
  Ria Paul, 
  Prakash Dubey 
*/

const mongoose = require("mongoose");
const Joi = require("joi");
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const nanoid = require("nanoid").customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  6
);

const examSchema = new mongoose.Schema({
  exam_details: {
    subject_code: String,
    examination_name: String,
    exam_date: Date,
    start_time: Date,
    end_time: Date,
    total_marks: Number,
    passing_marks: Number,
    num_options: Number,
    tmail: String,
    createdOn: { type: Date, default: Date.now }
  },
  students: [
    {
      first_name: String,
      last_name: String,
      obtained_marks: {type: Number, default: 0},
      email: { type: String },
    }
  ],
  questions: [
    {
      name: String,
      options: [String],
      // option1: String,
      // option2: String,
      correct_option: String,
      points: Number
    }
  ]
});

// {
//   exam_details: {
//     subject_code: "abcd",

//   },
//   students: [
//     student1: {
//       first_name:,
//       last_name,

//     },
//     student2: {
//       first_name:,
//       last_name,
//     }
//   ]
// }

// examSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtsecret"), {
//     expiresIn: "1h",
//   });
//   return token;
// };

// const validateSchema = Joi.object({
//   email: Joi.string().email().required(),
//   name: Joi.string().min(3).required(),
//   institute: Joi.string().required(),
// });

// examSchema.methods.validPassword = (password) => {
//     return bcrypt.compareSync(password, this.password);
// }

const Exam = mongoose.model("Exam", examSchema);

// module.exports = {
//   Exam,
//   validateSchema,
// };

module.exports = Exam;