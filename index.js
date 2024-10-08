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

app.get("/", async function (req, res) {
    try {
        // Fetch weather data for the default city (Tartu)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message); // Handle API errors
        }

        let description = data.weather[0]?.description || "No description available";
        let cityName = data.name;
        let temp = Math.round(parseFloat(data.main.temp) - 273.15); // Convert Kelvin to Celsius

        // Render index with fetched data
        res.render('index', {
            city: cityName,
            description: description,
            temperature: temp,
            error: null
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);

        // Render error
        res.render('index', {
            city: null,
            description: null,
            temperature: null,
            error: "Error fetching weather data. " + error.message
        });
    }
});

app.post("/", async function (req, res) {
    let city = req.body.cityname; // Capture city from form input

    if (!city || city.trim() === '') {
        res.render('index', { 
            city: null, 
            description: null, 
            temperature: null, 
            error: 'Please enter a valid city name' 
        });
        return;
    }

    try {
        // Fetch weather data for the provided city
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message); // Handle API errors
        }

        let description = data.weather[0]?.description || "No description available";
        let cityName = data.name;
        let temp = Math.round(parseFloat(data.main.temp) - 273.15); // Convert Kelvin to Celsius

        // Render index with fetched data
        res.render('index', {
            city: cityName,
            description: description,
            temperature: temp,
            error: null
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);

        // Render error
        res.render('index', {
            city: null,
            description: null,
            temperature: null,
            error: 'Problem with getting data, try again! ' + error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
