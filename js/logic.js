var searcher = $('#search-button')
var searchValue = $('#search-input')
var apiKey = '04e5fba2c94ff0b6d300e35273e2b3ad'
var iconUrl = 'http://openweathermap.org/img/wn/'
var dayOne = $('#dayOne')
var otherDays = $('#forecastSection')
var itemWrapper = $('#dayOne')
var searchText = ""
var iconEnd = '@2x.png'

function displayMatches(matches) {
  otherDays.html('');
  console.log(matches)
  for (var matchObj of matches) {
    console.log(matchObj.main.temp - 273.5)
    otherDays.append(`
    <div class="row weatherblock" style="background-image: url(${iconUrl + matchObj.weather[0].icon + iconEnd}">
      <div class="row column opacity">
        <h7>City:</h7>
        <h7>Date:</h7>
        <h7>Temperature:</h7>
        <h7>Humidity:</h7>
        <h7>Wind:</h7>
      </div>
      <div class="row column">
        <h7>${searchText}</h7>
        <h7>17/12/2022</h7>
        <h7>${Math.round(matchObj.main.temp - 273.5)}</h7>
        <h7>${matchObj.main.humidity}</h7>
        <h7>${matchObj.wind.speed}</h7>
      </div>
    </div>`);
  }
}

function getWeatherData(event) {
  event.preventDefault()
  searchText = searchValue.val().trim();
  if (searchText) {
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${apiKey}&units=metric`)
      .then(function (currentData) {
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${apiKey}`)
          .then(function (forecastData) {
            var listings = (forecastData.list)
            displayMatches(listings);
          })
      })
  }
}
function init() {
  searcher.click(getWeatherData);
}
init();
