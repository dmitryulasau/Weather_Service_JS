// API key
const apiKey = "7ad973834d820c61d3e3980c84791d85";
const placeKey = "02d451825349e3a5d30edc209e091fb6";

//
const check = document
  .querySelector(".btn")
  .addEventListener("click", (event) => handleSubmit(event));

// HANDLE SUMBIT
function handleSubmit(event) {
  event.stopPropagation();
  event.preventDefault();

  let location = document.getElementsByName("location")[0].value;
  console.log(location);

  checkWeather(location);
}

async function checkWeather(location) {
  if (/^\d+$/.test(location)) {
    // IF LOCATION == ZIP
    result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=${apiKey}&units=imperial`
    );
  } else {
    result = await axios.get(
      // IF LOCATION == CITY
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
    );
  }

  result = result.data;
  const lat = result.coord.lat;
  const lon = result.coord.lon;

  let resultFull = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
  );
  resultFull = resultFull.data;
  console.log(resultFull);

  console.log("FULL RESULT");
  console.log(resultFull);

  // DISPLAYING DATA ////////////////////////////////////////

  // LOCATION NAME
  let place = document.getElementsByTagName("h4")[0];
  place.innerHTML = result.name;
  // CURRENT TEMP
  let currentTemp = document.getElementsByTagName("h2")[0];
  currentTemp.innerHTML = `${Math.round(result.main.temp)}\u00B0 F`;
  // WEATHER DESCRIPTION
  let description = document.getElementsByTagName("h3")[0];
  description.innerHTML =
    result.weather[0].description[0].toUpperCase() +
    result.weather[0].description.slice(1);

  // CHANGE AN IMAGE FOR WEATHER DESCRIPTION
  let statusImage = document.getElementById("status-image");
  console.log("CONDITIONS:");
  console.log(result.weather[0].main);

  switch (result.weather[0].main) {
    case "Clear":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660530090/clear_vo5iam.gif')";
      break;
    case "Clouds":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660518756/vQJxxY_ymcqbn.gif')";
      break;
    case "Thunderstorm":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660519068/storm_znsghd.gif')";
      break;
    case "Drizzle":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660519364/rain_l4paci.gif')";
      break;
    case "Rain":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660519218/rain-raining_uzfnkr.gif')";
      break;
    case "Snow":
      statusImage.style.backgroundImage =
        "url('https://res.cloudinary.com/dulasau/image/upload/v1660519436/snow-falling_hdouhi.gif')";
      break;
  }

  // FEELS LIKE
  let feelsLike = document.getElementsByTagName("h5")[0];
  feelsLike.innerText = `${Math.round(result.main.feels_like)}\u00B0 F`;

  // UV INDEX
  let uvIndex = document.getElementsByTagName("h5")[1];
  uvIndex.innerText = `${Math.round(resultFull.current.uvi)}`;

  // HUMIDITY
  let humidity = document.getElementsByTagName("h5")[2];
  humidity.innerText = `${Math.round(resultFull.current.humidity)}%`;

  // WIND AND WIND DIRECTION
  let windDirection = resultFull.current.wind_deg;
  console.log(windDirection);
  let direction = "";

  if (windDirection <= 45) {
    direction += "NE";
  } else if (windDirection <= 90) {
    direction += "E";
  } else if (windDirection <= 135) {
    direction += "SE";
  } else if (windDirection <= 180) {
    direction += "S";
  } else if (windDirection <= 225) {
    direction += "SW";
  } else if (windDirection <= 270) {
    direction += "W";
  } else if (windDirection <= 315) {
    direction += "NW";
  } else if (windDirection <= 360) {
    direction += "N";
  }

  let wind = document.getElementsByTagName("h5")[3];
  wind.innerText = `${Math.round(
    resultFull.current.wind_speed
  )} mph ${direction}`;

  // PRESSURE
  let pressure = document.getElementsByTagName("h5")[4];
  pressure.innerText = `${(
    Math.round(result.main.pressure) / 33.863886666667
  ).toFixed(2)} inHg`;

  // PRESSURE
  let visibility = document.getElementsByTagName("h5")[5];
  visibility.innerText = `${Math.round(
    resultFull.current.visibility / 1609.344
  )} mi`;
}

// GETTING LOCATION (XML AAAAAAAAAAA!!!!)
window.onload = async function () {
  // let geo = await axios.get(
  //   `http://api.ipstack.com/134.201.250.155?access_key=32f839802afbd4b4bf926b715ddacac8`
  // );
  // geo = geo.data;
  // console.log(geo);
  // mycity = geo.city;
  // console.log(mycity);
  // checkWeather(mycity);
  getLocation();
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);

  let geo =
    await axios.get(`https://api.geonames.org/findNearestAddress?lat=${latitude}&lng=${longitude}&username=dmitrushok
  `);

  geo = geo.data; // XML
  console.log(geo);

  if (window.DOMParser) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(geo, "text/xml");
  } else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(geo);
  }

  let curCity = "";

  curCity = xmlDoc.getElementsByTagName("placename")[0].childNodes[0].nodeValue;
  checkWeather(curCity);
}

// DATE
let today = new Date();
let day = today.getDay();
let daylist = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday ",
  "Thursday",
  "Friday",
  "Saturday",
];
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

document.getElementById("displayDateTime").innerHTML = `${daylist[day]} ${date}
`;
