// weatherApp
let userTab = document.getElementById("YourWeather");
let searchTab = document.getElementById("selectCity");
let searchForm = document.getElementById("searchForm");
let weatherInfo = document.getElementById("weather-info");
let grantLocation = document.getElementById("grantLocation");
let loadingScreen = document.getElementById("loading");
let searchBtn = document.getElementById("searchBtn");
let inpCity = document.getElementById("inpCity");
let notFound = document.getElementById("not-found");
let currentTab = userTab;
currentTab.classList.add("curr-Tab");
const API_KEY = "142bbbaf5ab083b2f8f8fcf34fd51f75";
getfromSessionStorage();

//
function switchTab(newTab) {
  if (newTab != currentTab) {
    currentTab.classList.remove("curr-Tab");
    currentTab = newTab;
    currentTab.classList.add("curr-Tab");
    if (!searchForm.classList.contains("active")) {
      grantLocation.classList.remove("active");
      weatherInfo.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      // weatherInfo.classList.remove("active");
      getfromSessionStorage();
    }
  }
}
function getfromSessionStorage() {
  notFound.classList.remove("active");
  let localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantLocation.classList.add("active");
  } else {
    let cordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(cordinates);
  }
}

async function fetchUserWeatherInfo(cordinates) {
  const { lat, lon } = cordinates;
  try {
    grantLocation.classList.remove("active");
    loadingScreen.classList.add("active");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    let data = await response.json();
    loadingScreen.classList.remove("active");
    weatherInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    console.log("error in laoding api");
  }
}
function renderWeatherInfo(dataset) {
  let cityName = document.querySelector("[data-cityName]");
  let countryIcon = document.querySelector("[data-countryIcon]");
  let weatherStatus = document.querySelector("[data-weatherStatus]");
  let weatherIcon = document.querySelector("[data-weatherIcon]");
  let temp = document.querySelector("[data-temp]");
  let windSpeed = document.querySelector("[data-windSpeed]");
  let humidity = document.querySelector("[data-humidity]");
  let clouds = document.querySelector("[data-clouds]");

  console.log(dataset);
  cityName.innerHTML = `${dataset?.name}`;

  countryIcon.src = `https://flagcdn.com/144x108/${dataset?.sys?.country.toLowerCase()}.png`;

  weatherStatus.innerHTML = dataset?.weather?.[0]?.description;

  weatherIcon.src = `http://openweathermap.org/img/w/${dataset?.weather?.[0]?.icon}.png`;

  temp.innerHTML = `${dataset?.main?.temp} celcius`;
  windSpeed.innerHTML = `${dataset?.wind?.speed} Km/hr`;
  humidity.innerHTML = `${dataset?.main?.humidity} %`;
  clouds.innerHTML = `${dataset?.clouds?.all} %`;
}
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});
userTab.addEventListener("click", () => {
  switchTab(userTab);
});
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
grantLocation.addEventListener("click", getLocation);
searchBtn.addEventListener("click", () => {
  let cityname = inpCity.value;

  if (cityname === "") return;
  else fetchSearchWeatherInfo(cityname);
});
async function fetchSearchWeatherInfo(cityname) {
  loadingScreen.classList.add("active");
  weatherInfo.classList.remove("active");
  grantLocation.classList.remove("active");

  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`
    );
    let dataset = await response.json();
    notFound.classList.remove("active");
    loadingScreen.classList.remove("active");
    if (dataset?.name == undefined) {
      notFound.classList.add("active");
      return;
    }
    weatherInfo.classList.add("active");
    renderWeatherInfo(dataset);
  } catch {
    console.log("error in city api");
  }
}
