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
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();
        console.log(data);
        res.render("index", { weather: data });  // kasutasin tehisintelekti abiks kui ei töötand
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
