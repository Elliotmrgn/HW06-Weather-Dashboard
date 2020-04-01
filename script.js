$(document).ready(function () {

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"))||["New York", "Los Angeles", "London", "Paris", "Berlin", "Tokyo", "Beijing", "Seoul"];
    const today = moment();

    function init() {
        $('.item3').empty();
        $('.forcast-container').empty();
        $("#search-history").empty();
        searchHistory.splice(10);
        var history = $("#search-history")
        for (let i = 0; i < searchHistory.length; i++) {
            var li = $('<li class="list-group-item">' + searchHistory[i] + '</li>');
            li.attr("data-name", searchHistory[i]);
            history.append(li)
            
        }
    }

        function onLoad(){
            search(searchHistory[0]);
        }

    function search(userSearch) {
       
        
        init();
        var APIkey = 'f47d5053676fb82ab09b20cc6e10f36c';
        var queryURL = 'https://api.openweathermap.org/data/2.5/weather?' +
            'q=' + userSearch + '&units=imperial&appid=' + APIkey;

        $.ajax({
            url: queryURL,
            method: 'GET'
        })

            .then(function (response) {
                console.log(response)
                var searchResult = $("<div>")
                searchResult.append('<h1>' + response.name + ' (' + today.format('l') + ')</h1><img id="wicon" src="http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png" alt="weather icon">');
                searchResult.append('<p>Temperature: ' + response.main.temp + '</p>');
                searchResult.append('<p>Humidity: ' + response.main.humidity + '%</p>');
                searchResult.append('<p>Wind Speed: ' + response.wind.speed + ' MPH</p>');


                var lon = response.coord.lon;
                var lat = response.coord.lat;

                var uvQueryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + APIkey;

                $.ajax({
                    url: uvQueryURL,
                    method: 'GET'
                })

                    .then(function (response) {
                        console.log('***********  UV  ***************', response);
                        //uv severity check
                        var severe;
                        if (response.value >= 7) {
                            severe = 'bg-danger'
                        }
                        else if (response.value <= 3) {
                            severe = 'bg-success'
                        }
                        else {
                            severe = 'bg-warning'
                        }
                        searchResult.append('<p>UV Index: <span id="uv" class="' + severe + '">' + response.value + '</span></p>');
                        $(".item3").append(searchResult);
                    })

                var forcastQueryURL = 'https://api.openweathermap.org/data/2.5/forecast/?q=' + userSearch + '&units=imperial&appid=' + APIkey;

                $.ajax({
                    url: forcastQueryURL,
                    method: 'GET'
                })

                    .then(function (response) {
                        console.log('***********  forcast  ***************', response);
                        //starting point for the forcast array
                        var listNum = 1;
                        //builds each forcast block
                        for (var i = 1; i <= 5; i++) {
                            var newDate = moment();
                            var tempHigh = 0;
                            var tempLow = 999;
                            var limit = 8;
                            //check for the last day which has only 7 times
                            if (i === 5) {
                                limit = 7;
                            }
                            //checks high and low for each of the 8 times
                            for (var x = 0; x < limit; x++) {
                                if (tempHigh < response.list[listNum].main.temp_max) {
                                    tempHigh = response.list[listNum].main.temp_max;
                                }
                                if (tempLow > response.list[listNum].main.temp_min) {
                                    tempLow = response.list[listNum].main.temp_min;
                                }
                                if (x === 5) {
                                    var icon = response.list[listNum].weather[0].icon;
                                    var humidity = response.list[listNum].main.humidity;
                                }
                                listNum++;
                            }

                            
                            
                            var forcastCard = $('<div class="card bg-info forcast col-2 container-fluid"></div>');
                            var forcastContent = $('<div class="card-body"></div>');
                            forcastContent.append('<div class="card-title">' + newDate.add(i, 'days').format('l') + '</div>');
                            forcastContent.append('<img id="wicon" src="http://openweathermap.org/img/wn/' + icon + '@2x.png" alt="weather icon">');
                            forcastContent.append('<p class="card-text">High: ' + tempHigh + '</p> ');
                            forcastContent.append('<p class="card-text">Low: ' + tempLow + '</p> ');
                            forcastContent.append('<p class="card-text">Humidity: ' + humidity + '%</p> ');
                            forcastCard.append(forcastContent);
                            $('.forcast-container').append(forcastCard);
                        }

                    })
            })
    }

    init();
    onLoad();

    $(document).on('click', '.list-group-item', function () {
        
        var recentSearch = this.textContent
        searchHistory.unshift(recentSearch);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        search(recentSearch);
    })

    $('#search').click(function (e) {
        e.preventDefault();
        var userSearch = $('#city-search').val().trim();
        searchHistory.unshift(userSearch);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        search(userSearch);

    });
})