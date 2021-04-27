/* 
  Authors: 
  Ria Rupini, 
  Maitri Majumder, 
  Ria Paul, 
  Prakash Dubey 
*/

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
