const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const OPENUV_API_KEY = process.env.REACT_APP_OPENUV_API_KEY;

console.log('OpenWeather API Key:', OPENWEATHER_API_KEY);
console.log('OpenUV API Key:', OPENUV_API_KEY);

const getUVIndex = async (lat, lon) => {
    const uvIndexURL = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`;
    console.log('UV Index URL:', uvIndexURL);

    try {
        const response = await fetch(uvIndexURL, {
            headers: {
                'x-access-token': OPENUV_API_KEY
            }
        });

        console.log('UV Index Response Status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch UV index data from OpenUV API:', errorText);
            throw new Error('Failed to fetch UV index data from OpenUV API');
        }

        const data = await response.json();
        console.log('UV Index Data:', data);
        return data.result.uv;
    } catch (error) {
        console.error('Error in getUVIndex:', error);
        throw error;
    }
};

const getWeatherData = async (city, stateCode, countryCode = 'US', units = 'metric') => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${stateCode},${countryCode}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
    const getIconURL = (iconId) => `https://openweathermap.org/img/wn/${iconId}.png`;

    try {
        console.log('Weather URL:', weatherURL);
        const response = await fetch(weatherURL);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch weather data from OpenWeather API:', errorText);
            throw new Error(`Weather data not found for ${city}, ${stateCode}, ${countryCode}`);
        }

        const data = await response.json();
        console.log('Weather Data:', data);

        const {
            sys: { country, sunrise, sunset },
            wind: { speed, deg },
            coord: { lat, lon },
            weather,
            main: { temp, feels_like, humidity, pressure },
            name,
            timezone,
        } = data;

        const { main, icon } = weather[0];

        const uvIndex = await getUVIndex(lat, lon);

        return {
            country,
            sunrise,
            sunset,
            lat,
            lon,
            timezone,
            name,
            speed,
            deg,
            temp,
            feels_like,
            humidity,
            pressure,
            main,
            iconURL: getIconURL(icon),
            uvIndex,
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export { getWeatherData };
