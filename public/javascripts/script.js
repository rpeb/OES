/* 
  Authors: 
  Ria Rupini, 
  Maitri Majumder, 
  Ria Paul, 
  Prakash Dubey 
*/

function show_addStudent() {
  document.getElementById("addStu").style.display = "block";
  document.getElementById("removeStu").style.display = "none";
  document.getElementById("addTea").style.display = "none";
  document.getElementById("removeTea").style.display = "none";
  document.getElementById("createEx").style.display = "none";
}

function show_removeStudent() {
  document.getElementById("addStu").style.display = "none";
  document.getElementById("removeStu").style.display = "inline";
  document.getElementById("addTea").style.display = "none";
  document.getElementById("removeTea").style.display = "none";
  document.getElementById("createEx").style.display = "none";
}
function show_addTeacher() {
  document.getElementById("addStu").style.display = "none";
  document.getElementById("removeStu").style.display = "none";
  document.getElementById("addTea").style.display = "inline";
  document.getElementById("removeTea").style.display = "none";
  document.getElementById("createEx").style.display = "none";
}
function show_removeTeacher() {
  document.getElementById("addStu").style.display = "none";
  document.getElementById("removeStu").style.display = "none";
  document.getElementById("addTea").style.display = "none";
  document.getElementById("removeTea").style.display = "inline";
  document.getElementById("createEx").style.display = "none";
}
function show_createExam() {
  document.getElementById("addStu").style.display = "none";
  document.getElementById("removeStu").style.display = "none";
  document.getElementById("addTea").style.display = "none";
  document.getElementById("removeTea").style.display = "none";
  document.getElementById("createEx").style.display = "inline";
}
