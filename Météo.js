const cleApi = "c17afdcbfbc2c0f21ea9991b40bdabdd";
const urlApi = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const urlPrevisions = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const recherche = document.querySelector("#search");
const bouton = document.querySelector("#btn_search");
const conteneurJours = document.querySelector(".days");

function obtenirIconeMeteo(codeIcone) {
    const mapIcones = {
        '01d': 'day.svg', '01n': 'night.svg',
        '02d': 'cloudy-day-1.svg', '02n': 'cloudy-night-1.svg',
        '03d': 'cloudy.svg', '03n': 'cloudy.svg',
        '04d': 'cloudy.svg', '04n': 'cloudy.svg',
        '09d': 'rainy-6.svg', '09n': 'rainy-6.svg',
        '10d': 'rainy-3.svg', '10n': 'rainy-5.svg',
        '11d': 'thunder.svg', '11n': 'thunder.svg',
        '13d': 'snowy-6.svg', '13n': 'snowy-6.svg',
        '50d': 'cloudy.svg', '50n': 'cloudy.svg'
    };
    return `/icons/animated/${mapIcones[codeIcone] || 'day.svg'}`;
}

async function verifierMeteo(ville) {
    try {
        const reponse = await fetch(urlApi + ville + `&appid=${cleApi}`);
        const donnees = await reponse.json();

        document.querySelector(".city").innerText = donnees.name;
        document.querySelector(".temp").innerText = `${Math.round(donnees.main.temp)}°C`;
        document.querySelector(".humidity").innerText = `${donnees.main.humidity}%`;
        document.querySelector(".wind").innerText = `${donnees.wind.speed} km/h`;

        const iconeMeteo = donnees.weather[0].icon;
        document.querySelector(".picde img").src = obtenirIconeMeteo(iconeMeteo);

        const reponsePrevisions = await fetch(urlPrevisions + ville + `&appid=${cleApi}`);
        const donneesPrevisions = await reponsePrevisions.json();

        conteneurJours.innerHTML = '';
        const previsionJournalieres = {};

        donneesPrevisions.list.forEach(prevision => {
            const date = new Date(prevision.dt * 1000);
            const chaineDate = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

            if (!previsionJournalieres[chaineDate]) {
                previsionJournalieres[chaineDate] = {
                    tempMax: prevision.main.temp_max,
                    tempMin: prevision.main.temp_min,
                    icone: prevision.weather[0].icon
                };
            } else {
                previsionJournalieres[chaineDate].tempMax = Math.max(previsionJournalieres[chaineDate].tempMax, prevision.main.temp_max);
                previsionJournalieres[chaineDate].tempMin = Math.min(previsionJournalieres[chaineDate].tempMin, prevision.main.temp_min);
            }
        });

        Object.entries(previsionJournalieres).slice(0, 4).forEach(([date, prevision]) => {
            const carteJour = `
                <div class="day1">
                    <div class="card" style="border-radius: 40px; width: 170px; height: 200px; background-color: rgba(248, 249, 250, 0.5);">
                        <div class="card-body">
                            <h5 class="card-title">${date}</h5>
                            <img src="${obtenirIconeMeteo(prevision.icone)}" alt="">
                            <p>Max: ${Math.round(prevision.tempMax)}°C</p>
                            <p>Min: ${Math.round(prevision.tempMin)}°C</p>
                        </div>
                    </div>
                </div>
            `;
            conteneurJours.innerHTML += carteJour;
        });

    } catch (erreur) {
        console.error("Erreur", erreur);
        alert("error verifier  la ville.");
    }
}

bouton.addEventListener("click", function(evenement) {
    evenement.preventDefault();
    verifierMeteo(recherche.value);
});


verifierMeteo("Tokyo");
