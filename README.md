Good day!

This is a brief explanation regarding the content within this repo. Herein said repo are files
for a weather project; the weather is regarding the Elysium Plantitia plain on Mars. The app
consists of a week's duration of weather with temperature in celsius and fahrenheit (high and low),
as well as wind-speed (in MPH and KMH), wind-direction, and a link to additional information regarding
the InSight NASA mission that records aforementioned weather. Furthermore, the wind-direction is indicated
with a wind-marker that will change direction dynamically depending on which way the wind blows on the
selected day.

![image](https://user-images.githubusercontent.com/56378424/85315537-d9233c00-b480-11ea-9772-ac3af4e7ce49.png)
![image](https://user-images.githubusercontent.com/56378424/85315627-08d24400-b481-11ea-853e-8b51bf3473ad.png)

```
function displaySelectedSol(sols){  //takes in array of all the different sols
    const selectedSol = sols[selectedSolIndex]      //selectedSol var will equal whichever sol currently selected, or by default, it will be last sol
    currentSolElement.innerText = selectedSol.sol
    currentDateElement.innerText = displayDate(selectedSol.date)
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp)
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp)
    windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed)
    windDirectionArrow.style.setProperty('--direction',
        `${selectedSol.windDirectionDegrees}deg`)
    windDirectionText.innerText = selectedSol.windDirectionCardinal
}
```
```
function getWeather() {
    return fetch(API_URL)  //function queries API by using fetch
        .then(res => res.json()) //gives response; converting to json
        .then(data => {
            const {
                sol_keys,   //sol_keys property from api data
                validity_checks,
                ...solData  //everything that's not sol_keys or validity_checks; days of mars

            } = data    //destructuring data into multiple variables
            return Object.entries(solData).map(([sol, data]) => {   //allows for looping through an object; map converts one set of info into another;//map will take different properies from solData //solData will be array when called. in map, destructuring is taking place; sol is key, data is value (everything else)
                return {
                    sol: sol,       //key-value pairs
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    windDirectionDegrees: data.WD.most_common.compass_degrees,
                    windDirectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_UTC)
                }
            });
        });
}
```

The app provides a week of SOLS(days) on Mars, and information for each of the days:

```
let selectedSolIndex;   //declaring this as global variable; defining in getWeather function

getWeather().then(sols =>  {
    selectedSolIndex = sols.length - 1          //latest day is last sol
    displaySelectedSol(sols);   //display current sol selected
    displayPreviousSols(sols);  //display dynamically generated sols for week
    updateUnits();              //toggles displaying cel to fah and vice versa

    unitToggle.addEventListener('click', () => {
        let metricUnits = !isMetric()
        metricRadio.checked = metricUnits;
        imperialRadio.checked = !metricUnits;
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });

    metricRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });

    imperialRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });
}); //when calling getWeather, it's returning a promise; value being returned is below list of sols
```

Furthermore, as mentioned, wind-direction and temperature are available for each SOL(day):

```
function displayTemperature(temperature){
    let returnTemp = temperature
    if (!isMetric()) {
        returnTemp = (temperature - 32) * (5 / 9)
    }
    return Math.round(returnTemp);     //rounds to whole numbers
}

function displaySpeed(speed) {
    let returnSpeed = speed
    if (!isMetric()) {
        returnSpeed = speed / 1.609
    }
    return Math.round(returnSpeed)        //rounds speed
}
```

There is also the option between toggling between different temperature conventions, and between
MPH or KPH:

```
function updateUnits() {
    const speedUnits = document.querySelectorAll('[data-speed-unit]')
    const tempUnits = document.querySelectorAll('[data-temp-unit]')
    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    });
    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    });
}

function isMetric(){
    return metricRadio.checked
}
```

For more detailed examination/components of the app, please visit the CSS:
https://github.com/sinisatesic/mars-weather-app/blob/master/css/mars-weather.css
and JS files:
https://github.com/sinisatesic/mars-weather-app/blob/master/js/mars-weather.js
herein this repo.

If you have any questions, or wish to collaborate on any projects together, please let me know:
sinisa.tesic210@gmail.com
