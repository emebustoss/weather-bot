const axios = require('axios');
const cityList = require('./lists/cityList.json')
const countryCode = require('./lists/countryCode.json')


//Gets the Latitude and Longitude of the requested place by requesting the API
//
// const getLatLon = async(city, country) => {
//     const cityEncoded = encodeURIComponent(city);
//     const { data: { coord: { lon, lat } } } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityEncoded},${country}&lang=${lang}&appid=${process.env.appid}`)
//         .catch((error) => {
//             console.log(error + "rip");
//         })
//     return { lon, lat }
// }


//Gets the Latitude and Longitude of the requested place by the cityList JSON provided by the API
const getLatLon = async(city, country) => {
    try {
        return cityList.find((obj) => city.toLowerCase() === obj.name.toLowerCase() && country.toLowerCase() === obj.country.toLowerCase()).coord;

    } catch (error) {
        console.log(`error of the kind ${error.name}: ${error.message}\n\n`)
    }
}

//Gets the Country Code of 2 characters
const countryName = (country) => {
    return (countryCode.find((obj) => country.toLowerCase() === obj.countryName.toLowerCase()).twoCode)
}


// Gets the weather of the requested place
const getWeather = async(city, country, lang = "en") => {

    const countryTwoCode = countryName(country)
    const { lat, lon } = await getLatLon(city, countryTwoCode)

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=alerts,minutely,hourly&lang=${lang}&appid=${process.env.appid}`)
        .catch((error) => {
            console.log(`(Error in API) ${error}\n`)
        })


    // Data Handled
    const description = data.current.weather[0].description;
    const newDescription = description.charAt(0).toUpperCase() + description.slice(1)
    const temp = Math.round(data.current.temp);
    const icon = data.current.weather[0].icon


    const text = newDescription + " with " + temp + "°C";


    const nextDaysDesctiption = [];
    for (let i = 0; i < 8; i++) {
        var nextDescriptions = data.daily[i].weather[0].description
        nextDaysDesctiption.push(nextDescriptions.charAt(0).toUpperCase() + nextDescriptions.slice(1))
    }


    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dated = new Date();
    const weekDayNumber = dated.getDay();
    const monthDayNumber = dated.getDate();
    const days = [];
    for (let i = 0; i < 8; i++) {
        const weekDay = weekDayNumber + i;
        const monthDay = monthDayNumber + i;
        days.push(`${weekDays[weekDay > 6 ? weekDay - 7 : weekDay]} ${monthDay}`);
    }


    const nextDaysTempMin = [];
    for (let i = 0; i < 8; i++) {
        nextDaysTempMin.push(Math.round(data.daily[i].temp.min) + "°C")
    }
    const nextDaysTempMax = [];
    for (let i = 0; i < 8; i++) {
        nextDaysTempMax.push(Math.round(data.daily[i].temp.max) + "°C")
    }

    return { text, icon, days, nextDaysDesctiption, nextDaysTempMin, nextDaysTempMax }

}

module.exports = { getWeather };