var searcher = $('.search-button')
var searchValue = $('#search-input')
var apiKey = '04e5fba2c94ff0b6d300e35273e2b3ad'
var iconUrl = 'http://openweathermap.org/img/wn/'
var otherDays = $('#forecastSection')
var itemWrapper = $('#dayOne')
var searchText = ""
var iconEnd = '@2x.png'
var historical = $('#history')

function displayMatches(matches) {
  // clear any previous forecast, use a variable for the moment to increase 4 hours until 5 days, add the boxes
  otherDays.html('');
  var i = 0
  for (var matchObj of matches) {
    i = i + 4
    var currentDayMoment = moment().add(i, 'hours').format('Do MMM YYYY, hh A');
    otherDays.append(`
    <div class="row weatherblock" style="background-image: url(${iconUrl + matchObj.weather[0].icon + iconEnd}">
      <div class="row column opacity">
        <h7>City:</h7>
        <h7>Date:</h7>
        <h7>Temperature:</h7>
        <h7>Humidity:</h7>
        <h7>Wind:</h7>
      </div>
      <div class="row column" 
        <h7>${searchText}</h7>
        <h7>${currentDayMoment}</h7>
        <h7>${Math.round(matchObj.main.temp - 273.5)}°C</h7>
        <h7>${matchObj.main.humidity}%</h7>
        <h7>${matchObj.wind.speed}</h7>
      </div>
    </div>`);
  }
}

function getWeatherData(event) {
  //prevent form from deleting data and refreshing
  event.preventDefault()
  //trim data to useable value
  searchText = searchValue.val().trim() || $(event.target).text()
  //if a value was typed move forward
  if (searchText) {
    if (searchValue) {
      //check newest search is a history item if not add a button next refresh via local storage
      var newload = searchText
      // get items from local storage if nothing there present an empty array
      var searches = JSON.parse(localStorage.getItem('searches')) || [];
      // check if newload is already a history item if not then push to storage
      if (searches.indexOf(newload) == -1) {
        searches.push(newload)
        localStorage.setItem('searches', JSON.stringify(searches))
        historical.append(`
        <button type="submit" class="btn search-button" aria-label="submit search">${newload}</button>`)
        searcher = $('.search-button')
        //add a click event to the new item
        searcher.click(getWeatherData);
        // if a value was not typed use the history click event value as the input
      } else if ($(event.target).text())
        newload = $(event.target).text()
      searches = JSON.parse(localStorage.getItem('searches')) || [];
      if (searches.indexOf(newload) == -1) {
        searches.push(newload)
        localStorage.setItem('searches', JSON.stringify(searches))
        historical.append(`
        <button type="submit" class="btn search-button" aria-label="submit search">${newload}</button>`)
        searcher = $('.search-button')
        searcher.click(getWeatherData);
      }
      //get api data for current day and time
      $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${apiKey}&units=metric`)
        .then(function (currentData) {
          //add current data to master box removing previous data
          itemWrapper.html('');
          itemWrapper.append(`
        <div class="row column">
              <h5>City:</h5>
              <h5>Date:</h5>
              <h5>Temperature:</h5>
              <h5>Humidity:</h5>
            </div>
            <div class="row column weatherblock" style="background-image: url(${iconUrl + currentData.weather[0].icon + iconEnd}">
              <h5>${searchText}</h5>
              <h5>${moment().format('Do MMM YYYY')}</h5>
              <h5>${Math.round(currentData.main.temp)}°C</h5 >
              <h5>${currentData.main.humidity}%</h5>
            </div >
          </div > `);
          //get forecast using co-ordinates of current data
          $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${apiKey}`)
            .then(function (forecastData) {
              var listings = (forecastData.list)
              displayMatches(listings);
              console.log("here")
              searchValue.val("")
            })
        })
    }
  }
}
function init() {
  historical.html('');
  var searches = JSON.parse(localStorage.getItem('searches')) || [];
  if (searches.includes)
    for (var i = 0; i < searches.length; i++)
      historical.append(`
<button type="submit" class="btn search-button" aria-label="submit search">${searches[i]}</button>`)

  //on search click get data for new or historic search
  searcher = $('.search-button')
  searcher.click(getWeatherData);
}
init();
