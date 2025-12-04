const express = require("express")
const router = express.Router()
const request = require('request')

// routes/weather.js

router.get('/', (req, res) => {
    res.render('weather', { weather: null, error: null });
});


router.post('/', (req, res, next) => {

    // Step 9 (insert your API key)
    let apiKey = '8f8c84e4bfd04a349780f3edbc575258';  
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;




        request(url, (err, response, body) => {
        if (err) {
            return res.render('weather', { weather: null, error: 'Error fetching weather data.' });
        }

        let weather;
        try {
            weather = JSON.parse(body);
        } catch (e) {
            return res.render('weather', { weather: null, error: 'Error parsing weather data.' });
        }

     
        if (weather && weather.main) {
            res.render('weather', { weather: weather, error: null });
        } else {
            res.render('weather', { weather: null, error: 'No data found for the city you entered.' });
        }
        
        
    });
});




module.exports = router;
