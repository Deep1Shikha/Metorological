//select elements

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

//app consts and vars
const KELVIN = 273;
//API KEY
const key = "5a8832e4b680a91e82968e34fedc063a";

//check if browser supports geo-location
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> Browser does not support geolocation</p>";
}

//set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// show error when there is any issue with geolocation service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`
    displayDefaultWeather();
}

//Get weather from API provider
function getWeather(latitude, longitude){
    let api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api);    

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;

            console.log(weather.description);
        })
        .then(function(){
            displayWeather();
        });
} 

//Display weather to UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`;  
    tempElement.innerHTML = `${weather.temperature.value}*<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function displayDefaultWeather(){
    iconElement.innerHTML = `<img src="icons/50n.png">`;  
    tempElement.innerHTML = `25*<span>C</span>`;
    descElement.innerHTML = "mist";
    locationElement.innerHTML = "Daltonganj, IN";
}

//C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// When the user clicks on the temperature element
tempElement.addEventListener("click", function(){
  if(weather.temperature.value === undefined) return;

  if(weather.temperature.unit == "celsius"){
     let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
     fahrenheit = Math.floor(fahrenheit);
      tempElement.innerHTML = `${fahrenheit}*<span>F</span>`;
      weather.temperature.unit = "Fahrenheit";
  }else{
      tempElement.innerHTML = `${weather.temperature.value}*<span>C</span>`;
      weather.temperature.unit = "celsius";
  }

});