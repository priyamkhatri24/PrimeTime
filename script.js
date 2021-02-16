"use strict";
const minutes = document.querySelector(".mins");
const seconds = document.querySelector(".secs");
const hours = document.querySelector(".hours");
const controlBtns = document.querySelector(".control_btns");
const flagContainer = document.querySelector(".flags_list");
const navList = document.querySelector(".nav_list");
const milliSeconds = document.querySelector('.milli_secs')
const state = {
  min: 0,
  millisec:0,
  sec: 0,
  hrs: 0,
  minutesPassed: 1,
  hoursPassed: 1,
  time: 1,
  isCounting: false,
  flagged: [],
};
const controlNavigation = function () {
  navList.addEventListener("click", function (e) {
    if (!e.target.closest("li")) return;
    if (e.target.closest("li").textContent === "Countdown") {
      alert("This feature is under development. Please come back later");
    }
    if (e.target.closest("li").textContent === "Stopwatch") {
      return;
    }
  });
};
const timer = function (time) {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, time * 1000);
  });
};
const milliSecondsControl = async function() {
  for (let msec = 0; msec<100; msec++) {
    if (!state.isCounting) {
      return;
    }
    await timer(0.1)
    milliSeconds.textContent = formatNumbers(msec)
  }
}
const controlStopwatch = async function (minutesLength = 10) {
  for (state.time; ; state.time++) {
  for (let msec = 0; msec<100; msec++) {
    if (!state.isCounting) {
      return;
    }
    await timer(0.01)
    document.querySelector(".milli_secs").textContent = formatNumbers(msec)
    state.millisec = msec
  }
  // await timer(0.5);
    if (!state.isCounting) {
      return;
    }
    if (state.time >= minutesLength * state.minutesPassed) {
      ++state.min;
      minutes.textContent = formatNumbers(state.min);

      if (state.time % minutesLength === 0) state.minutesPassed++;
    }
    if (state.time >= minutesLength * minutesLength * state.hoursPassed) {
      ++state.hrs;
      hours.textContent = formatNumbers(state.hrs);
      if (state.time % (minutesLength * minutesLength) === 0) {
        state.hoursPassed++;
        state.min = 0;
        minutes.textContent = "00";
      }
    }
    state.sec = state.time - minutesLength * (state.minutesPassed - 1);

    seconds.textContent = formatNumbers(state.sec);
  }
};
const resetStopwatch = function () {
  state.min = 0;
  state.sec = 0;
  state.hrs = 0;
  state.minutesPassed = 1;
  state.hoursPassed = 1;
  state.time = 1;
};

const renderBtns = function () {
  const html = `
      <ion-icon class="icon stop_icon" name="stop-outline"></ion-icon>
      <ion-icon class="icon play_icon" name="${
        state.isCounting ? "pause" : "play"
      }-outline"></ion-icon>
      <ion-icon class="icon flag_icon" name="flag-outline"></ion-icon>
      `;
  controlBtns.innerHTML = "";
  controlBtns.insertAdjacentHTML("afterbegin", html);
};

const formatNumbers = function (number) {
  const formattedNum = number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return formattedNum;
};

const renderFlags = function () {
  const flagsMarkup = state.flagged
    .sort()
    .reverse()
    .map((ele, index) => {
      return `
    <div class="flag_row ${(index + 1) % 2 === 0 ? "odd" : "even"}">
      <h4 class="flag_emoji">🏁</h4>
      <h4>Flagged at:</h4>
      <h4 class="flagged_time">${ele}</h4>
    </div>
      `;
    })
    .join("");

  flagContainer.innerHTML = "";
  flagContainer.insertAdjacentHTML("afterbegin", flagsMarkup);
};

controlBtns.addEventListener("click", function (e) {
  const playBtn = e.target.closest(".play_icon");
  const stopBtn = e.target.closest(".stop_icon");
  const flagBtn = e.target.closest(".flag_icon");

  if (playBtn) {
    state.isCounting = !state.isCounting;
    renderBtns();
    if (state.isCounting) {
      controlStopwatch();
    }
    return;
  }

  if (stopBtn) {
    state.isCounting = false;
    state.flagged = [];
    seconds.textContent = "00";
    minutes.textContent = "00";
    hours.textContent = "00";
    renderBtns();
    resetStopwatch();
    renderFlags();
  }

  if (flagBtn) {
    const flag = `${formatNumbers(state.hrs)}:${formatNumbers(
      state.min
    )}:${formatNumbers(state.sec)}:${formatNumbers(state.millisec)}`;
    state.flagged.push(flag);
    renderFlags();
  }
});

controlNavigation();
