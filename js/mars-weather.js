//api key below



//selectors to customize
const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather');

const currentSolElement = document.querySelector('[data-current-sol]');

const currentDateElement = document.querySelector('[data-current-date]');

const currentTempHighElement = document.querySelector('[data-current-temp-high]');

const currentTempLowElement = document.querySelector('[data-current-temp-low]');

const windSpeedElement = document.querySelector('[data-wind-speed]');

const windDirectionText = document.querySelector('[data-wind-direction-text]');

const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');




//second section of attributes:
const previousSolTemplate = document.querySelector('[data-previous-sol-template]');

const previousSolContainer = document.querySelector('[data-previous-sols]');

const unitToggle = document.querySelector('[data-unit-toggle]');

const metricRadio = document.getElementById('cel');

const imperialRadio = document.getElementById('fah');



previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather');
});

//api functionality below

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


function displayPreviousSols(sols){
    previousSolContainer.innerHTML = '';     //clearing container
    sols.forEach((solData, index) => {      //loop through all sols; will have sol data, as well as index of each element inside of array (value and index of array)
        const solContainer = previousSolTemplate.content.cloneNode(true)    //will clone all html in template area and put into this solContainer var
        solContainer.querySelector('[data-sol]').innerText = solData.sol
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = index
            displaySelectedSol(sols)
        });
        previousSolContainer.appendChild(solContainer)
    })
}



function displayDate(date) {
    return date.toLocaleDateString( //functions takes 2 properties: locale to convert to (what language you want) , and
        undefined,                  //will return language based on user browser and what defaults they have set
        { day: 'numeric', month: 'long' } //long displays full month name
    )
}


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