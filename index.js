const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const key = "3054d6454fc65b6b1efa36463c757f19";
let city = "Tartu";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async function (req, res) {
    try {
        // Use backticks for template literals
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);

        // Parse the response
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);  // If the API returns an error, throw it
        }

        // Extract the data
        let description = data.weather[0]?.description || "No description available";  // Using optional chaining
        let cityName = data.name;
        let temp = Math.round(parseFloat(data.main.temp)-273.15)

        console.log(description);
        console.log(cityName);
        console.log(temp);

        // Render the template and pass data
        res.render('index', {
            city: cityName,
            description: description,
            temperature: temp,
            error: null
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);

        // Handle error and render the page with the error message
        res.render('index', {
            city: null,
            description: null,
            temperature: null,
            error: "Error fetching weather data. " + error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
