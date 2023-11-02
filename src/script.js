const API_KEY = "b85ba958f57100940d2bf7395ad5ad45";
// Selections
const button = document.querySelector(".submit-button");
const input = document.querySelector(".input-field");
const h1 = document.querySelector("h1");
const headers = document.querySelectorAll(".headers");
const clock = document.querySelector(".clock-container");
const dateContainer = document.querySelector(".date-container");
const infos = document.querySelectorAll(".infos");

// State object
const state = {
  name: "",
  country: "",
  temp: "",
  desc: "",
  humidity: "",
};

// Time out for wrong search
const setTimeOutHeader = function (second) {
  return setTimeout(() => {
    h1.textContent = "⛅Weather - App";
  }, second * 1000);
};

// Get position
const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      },
      function () {
        reject("Failed to take your location");
      }
    );
  });
};

// Get results by location :
const getJSONLocation = async function () {
  try {
    const { latitude, longitude } = await getPosition();

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const data = await res.json();

    state.name = data.name;
    state.country = data.sys.country;
    state.temp = +(data.main.temp - 273.15).toFixed();
    state.desc = data.weather[0].description;
    state.humidity = data.main.humidity;

    generateMarkup();
  } catch (err) {
    renderError("Cannot find your location! Allow us.");
    setTimeOutHeader(2, 5);
  }
};

// Get results by search :
const getJSONSearch = async function (city) {
  try {
    input.value = "";

    // Fetch API for search
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await res.json();

    // Set new state :
    state.name = data.name;
    state.country = data.sys.country;
    state.temp = +(data.main.temp - 273.15).toFixed();
    state.desc = data.weather[0].description;
    state.humidity = data.main.humidity;

    if (!city) throw error;
    infos.forEach((el) =>
      el.querySelectorAll(".weather-data").forEach((data) => data.remove())
    );

    // Generate markup with NEW state
    generateMarkup();
  } catch (err) {
    renderError(`Can't find this city. Try another!`);
    setTimeOutHeader(2);
  }
};

// Button submit event :
button.addEventListener("click", function (e) {
  e.preventDefault();
  const city = input.value;
  getJSONSearch(city);
});

// At the beginning call data with location
const init = function () {
  getJSONLocation();
};
init();

// Generate results
const generateMarkup = function () {
  let html = `
        <div class="weather-data">${state.name}</div>
    `;

  // For each header add weather-data dynamicly

  // el.lastElementChild.classList.contains

  infos.forEach((el) => {
    if (el.classList.contains("city")) el.insertAdjacentHTML("beforeend", html);
    else if (el.classList.contains("country"))
      el.insertAdjacentHTML(
        "beforeend",
        (html = `<div class="weather-data">${state.country}</div>`)
      );
    else if (el.classList.contains("temp"))
      el.insertAdjacentHTML(
        "beforeend",
        (html = `<div class="weather-data">${state.temp}°C</div>`)
      );
    else if (el.classList.contains("desc"))
      el.insertAdjacentHTML(
        "beforeend",
        (html = `<div class="weather-data">${
          state.desc.at(0).toUpperCase() + state.desc.slice(1)
        }</div>`)
      );
    else if (el.classList.contains("humidity"))
      el.insertAdjacentHTML(
        "beforeend",
        (html = `<div class="weather-data">${state.humidity}%</div>`)
      );
  });
};

// Calculate Time
const calculateTimeAndDate = function () {
  // Get dates
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const seconds = now.getSeconds();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate()}`.padStart(2, 0);

  // Markup for date
  const markupDate = `
  <div class="date day">${day}/${month}/${year}</div>
  `;
  dateContainer.querySelector(".day").innerHTML = markupDate;

  // Markup for clock
  const markupClock = `
  <div class="clock minute">${`${hour}`.padStart(2, 0)}:${`${minute}`.padStart(
    2,
    0
  )}:${`${seconds}`.padStart(2, 0)}</div>
  `;
  clock.querySelector(".time").innerHTML = markupClock;
};
calculateTimeAndDate();

// Interval for clock
const clockInterval = function () {
  return setInterval(calculateTimeAndDate, 1000);
};
clockInterval();

const renderError = function (err) {
  h1.textContent = err;
};
