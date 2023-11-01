const API_KEY = "b85ba958f57100940d2bf7395ad5ad45";
// Selections
const button = document.querySelector(".submit-button");
const input = document.querySelector(".input-field");
const h1 = document.querySelector("h1");
const headers = document.querySelectorAll(".headers");

const infos = document.querySelectorAll(".infos");

const state = {
  name: "",
  country: "",
  temp: "",
  desc: "",
  humidity: "",
};

const setTimeOutHeader = function () {
  return setTimeout(() => {
    h1.textContent = "⛅Weather - App";
  }, 1500);
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
    console.error("Hava durumu bilgisi alinamadi", err);
  }
};

// Get results by search :
const getJSONSearch = async function (city) {
  try {
    if (!city) h1.textContent = "There is no query for city!";
    infos.forEach((el) =>
    el.querySelectorAll(".weather-data").forEach((data) => data.remove())
  );
    // headers.forEach((el) =>
    //   el.querySelectorAll(".weather-data").forEach((data) => data.remove())
    // );
    // headers.forEach((el) =>
    //   el.parentElement
    //     .querySelectorAll(".weather-data")
    //     .forEach((data) => data.remove())
    // );
    input.value = "";

    // Turn h1 back
    setTimeOutHeader();

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

    // Generate markup with NEW state
    generateMarkup();

  } catch (err) {
    console.error("Hava durumu bilgisi alinamadi", err);
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

//   headers.forEach((el) => {
//     if (el.classList.contains("city")) el.insertAdjacentHTML("beforeend", html);
//     else if (el.classList.contains("country"))
//       el.insertAdjacentHTML(
//         "beforeend",
//         (html = `<div class="weather-data">${state.country}</div>`)
//       );
//     else if (el.classList.contains("temp"))
//       el.insertAdjacentHTML(
//         "beforeend",
//         (html = `<div class="weather-data">${state.temp}°C</div>`)
//       );
//     else if (el.classList.contains("desc"))
//       el.insertAdjacentHTML(
//         "beforeend",
//         (html = `<div class="weather-data">${
//           state.desc.at(0).toUpperCase() + state.desc.slice(1)
//         }</div>`)
//       );
//     else if (el.classList.contains("humidity"))
//       el.insertAdjacentHTML(
//         "beforeend",
//         (html = `<div class="weather-data">${state.humidity}%</div>`)
//       );
//   });
};

// to calculate celcius [ temp -273.15 ]
