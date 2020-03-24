$('#search').click(function (e) {
    e.preventDefault();
    $('.item3').empty();

    const today = moment();
    
    var search = $('#city-search').val();
    
    
    
    
    var APIkey = 'f47d5053676fb82ab09b20cc6e10f36c';
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?' +
        'q=' + search + '&units=imperial&appid=' + APIkey;

    $.ajax({
        url: queryURL,
        method: 'GET'
    })

        .then(function (response) {
            console.log(response)
            
            $('.item3').append('<h1>'+response.name + ' (' + today.format('l') + ')</h1>');
            $('.item3').append('<p>Temperature: ' + response.main.temp + '</p>');
            $('.item3').append('<p>Wind Speed: ' + response.wind.speed + ' MPH</p>');
            
            var lon = response.coord.lon;
            var lat = response.coord.lat;

            var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + APIkey;

            $.ajax({
                url: queryURL,
                method: 'GET'
            })

                .then(function (response) {
                    console.log('***********  UV  ***************', response);
                    $('.item3').append('<p>UV Index: ' + response.value + '</p>');
                })
        });

})