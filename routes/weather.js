const request = require('request');
require('dotenv').config();
const{ check, validationResult } = require('express-validator');

module.exports = function(app, appData) {
    // GET weather search page
    app.get('/weather', function(req, res) {
        // Render the form
        res.render('weather.ejs', {
            appData: appData,
            weather: null,
            error: null
        });
    });

    // POST weather results
    app.post('/weather',
        [
            check('city')
            .trim()
            .notEmpty()
            .withMessage('Please enter a city name')
        ],

        function(req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Re-render with error message if validation fails
                return res.render('weather.ejs', {
                    appData: appData,
                    weather: null,
                    error: errors.array()[0].msg
                });
            }

            const city = req.sanitize(req.body.city);
            const apiKey = process.env.OPENWEATHER_API_KEY;

            const url = 
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

            request(url, function(err, response, body) {
                if (err) {
                    return res.render('weather.ejs', {
                        appData: appData,
                        weather: null,
                        error: 'Request failed'
                    });
                }

                try {
                    const weatherData = JSON.parse(body);

                    if (weatherData.cod !== 200) {
                        res.render('weather.ejs', {
                            appData: appData,
                            weather: null,
                            error: weatherData.message
                        });
                    } else {
                        res.render('weather.ejs', {
                            appData: appData,
                            weather: weatherData,
                            error: null
                        });
                    }
                } catch (parseError) {
                    res.render('weather.ejs', {
                        appData: appData,
                        weather: null,
                        error: 'Error parsing response'
                    });
                }
            });
        }
    )
}