const formidable = require('formidable'),
  xlsx = require('xlsx');

module.exports = function getStudent(req, res, next) {
  try {
    // console.log('REQUEST IN FORMIDABLE', req.body);
    req.body.fields = {};
    req.body.worksheets = [];
    new formidable.IncomingForm()
      .parse(req)
      .on("fileBegin", (name, file) => {
        file.path = global.appRoot + "/uploads/" + file.name;
      })
      .on("file", function (name, file) {
        // console.log("Got file:", file.name);
        let worksheets = {};
        const workbook = xlsx.readFile(
          global.appRoot + "/uploads/" + file.name
        );
        for (const sheetName of workbook.SheetNames) {
          worksheets[sheetName] = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
        }
        req.body.worksheets.push(worksheets);
      })
      .on("field", function (name, field) {
        // console.log("name: ", name, "field: ",field);
        req.body.fields[name] = field;
      })
      .on("error", function (err) {
        next(err);
      })
      .on("end", function () {
        next();
      });
  } catch (err) {
    console.log(err.message);
  }
};
