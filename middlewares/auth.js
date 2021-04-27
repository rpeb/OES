/* 
  Authors: 
  Ria Rupini, 
  Maitri Majumder, 
  Ria Paul, 
  Prakash Dubey 
*/

const isAuth = (req,res,next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).send('Not logged in!');
    }
}

const isAdmin = (req,res,next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden!!! <a href="/admin/login/">Login as admin</a>.');
    }
}

const isStudent = (req,res,next) => {
    if (req.isAuthenticated() && req.user.role === 'student') {
        next();
    } else {
        res.status(403).send('Forbidden!!! <a href="/student/login/">Login as student</a>.');
    }
}

const isTeacher = (req,res,next) => {
    if (req.isAuthenticated() && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).send('Forbidden!!! <a href="/teacher/login/">Login as Teacher</a>.');
    }
}

module.exports = {
    isAuth,
    isAdmin,
    isStudent,
    isTeacher
}