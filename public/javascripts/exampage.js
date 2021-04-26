// // var countDownDate = new Date("Apr 11, 2021 20:57:00").getTime();
// let expiryDate = new Date(new Date().setHours(new Date().getHours() + 2));
// // Update the count down every 1 second
// var x = setInterval(function() {

//   // Get today's date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = expiryDate - now;
// //   console.log(distance);

//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   if(days===0){
//     document.getElementById("demo").innerHTML = hours + "h "
//     + minutes + "m " + seconds + "s ";
//   } else{
//     document.getElementById("demo").innerHTML = days + "d " + hours + "h "
//     + minutes + "m " + seconds + "s ";
//   }

//   // Display the result in the element with id="demo"

//   // If the count down is finished, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     document.getElementById("demo").innerHTML = "EXPIRED";
//   }
// }, 1000);

// var prev=document.getElementById("prev");
// var next=document.getElementById("next");
// var counter=1;
// var num_questions=5;
// var qnum= document.getElementById("qnum");
// qnum.innerHTML=counter;
// prev.disabled=true;
// function decrement_qnum(){
//     if(qnum.innerHTML>1){
//         prev.disabled=false;
//         next.disabled=false;
//         counter=counter-1;
//         qnum.innerHTML=counter;
//         // next.disabled=false;
//     }
//     else{
//         prev.disabled=true;
//     }
// }
// function increment_qnum(){
//     if(counter===num_questions-1){
//         prev.disabled=false;
//         next.disabled=true;
//         qnum.innerHTML=counter+1;
//     }
//     else{
//         counter=counter+1;
//         qnum.innerHTML=counter;
//         prev.disabled=false;
//         next.disabled=false;
//     }
// }

// var question= document.getElementById("question").innerHTML="what is your name?"

// var countDownDate = new Date("Apr 11, 2021 20:57:00").getTime();
let expiryDate = new Date(new Date().setHours(new Date().getHours() + 2));
// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = expiryDate - now;
  //   console.log(distance);

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (days === 0) {
    document.getElementById("demo").innerHTML =
      hours + "h " + minutes + "m " + seconds + "s ";
  } else {
    document.getElementById("demo").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }

  // Display the result in the element with id="demo"

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);

for (var i = 0; i < 50; i++) {
  var q_butt = document.getElementById("q_buttons");
  q_butt.innerHTML += `<button class="button button5">${i + 1}</button>`;
}
