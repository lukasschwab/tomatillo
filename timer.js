var CLOCK_ID = 'clockdiv'
var COLORS = {
  "red": "#FF4136",
  "redtext": "hsla(3, 100%, 25%, 1.0)",
  "lime": "#01FF70",
  "limetext": "hsla(146, 100%, 20%, 1.0)"
}
var DEFAULT_TIMES = {
  "work": 45, FIXME
  "break": 15 FIXME
  // "work": .3,
  // "break": .1
}

function notify(intoWork) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    if (intoWork) {
      var notification = new Notification("Start working!")
    } else {
      var notification = new Notification("Take a break!")
    }
    // NOTE: I comment this out when testing locally because notifications break.
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (p) {
      console.log(p)
      console.log(intoWork)
      if (p === "granted") {
        if (intoWork) {
          var notification = new Notification("Start working!")
        } else {
          var notification = new Notification("Take a break!")
        }
      }
    })
  }
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeWorkClock(endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      switchToBreak();
    }
  }
  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

// Trigger UI for switch to break timer
function switchToBreak() {
  // Change background/text colors
  document.body.style.backgroundColor = COLORS.lime;
  document.body.style.color = COLORS.limetext;
  notify(false)
  // Set the new timer
  var duration;
  if (parseInt(breakSetting.value)) {
    duration = parseInt(breakSetting.value) * 60 * 1000;
  } else {
    duration = DEFAULT_TIMES.break * 60 * 1000;
  }
  initializeBreakClock(new Date(Date.parse(new Date()) + duration))
}

function initializeBreakClock(endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime)

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      switchToWork();
    }
  }
  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

// Trigger UI for switch to work timer
function switchToWork() {
  document.body.style.backgroundColor = COLORS.red;
  document.body.style.color = COLORS.redtext;
  notify(true);
  // Calculate next work duration, initialize clock
  var duration;
  if (parseInt(workSetting.value)) {
    duration = parseInt(workSetting.value) * 60 * 1000;
  } else {
    duration = DEFAULT_TIMES.work * 60 * 1000;
  }
  initializeWorkClock(new Date(Date.parse(new Date()) + duration))
}

// Load with initial timer set
var deadline = new Date(Date.parse(new Date()) + 10 * 1000);
// Pull elements from document
var clock = document.getElementById(CLOCK_ID);
var minutesSpan = clock.querySelector('.minutes');
var secondsSpan = clock.querySelector('.seconds');
var workSetting = document.getElementById("workMinutes")
var breakSetting = document.getElementById("breakMinutes")
// Start with work
switchToWork();