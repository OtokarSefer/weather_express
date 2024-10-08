const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const key = "3054d6454fc65b6b1efa36463c757f19";
let city = "Tartu";

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Function to get weather data
const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.json(); // Corrected typo here
            })
            .then(data => {
                let description = data.weather[0]?.description || "No description available"; // Optional chaining
                let cityName = data.name;
                let temp = Math.round(parseFloat(data.main.temp) - 273.15); // Convert Kelvin to Celsius
                let result = {
                    description: description,
                    city: cityName,
                    temperature: temp,
                    error: null
                };
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
};

app.all('/', function (req, res) {
    let city 
    if(req.method ==  'GET') {
      city =  'Tartu'
    }
    if(req.method == 'POST') {
      city = req.body.cityname
    }
    if (!city || city.trim() === '') {
      res.render('index', { error: 'Please enter a valid city name' });
      return;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
    .then(data => {
        res.render('index', data)
    })
    .catch(error => {
        res.render('index',  {error: 'Problem with getting data, try again!!!!!'})
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
