
// const apikey ="c17afdcbfbc2c0f21ea9991b40bdabdd";
const apiKey = "ba71f186309e4d93b5e4fb18dd830016";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const search = document.querySelector("#search");
const btn = document.querySelector("#btn_search");

async function getWeather(name) {
    const response = await fetch(apiUrl + name + `&appid=${apiKey}`);
    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerText = data.name;
    document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerText = data.main.humidity + " %";
    document.querySelector(".wind").innerText = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
        document.querySelector(".weather").innerText = "Céu limpo";
    }
}

btn.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    getWeather(search.value);
});
