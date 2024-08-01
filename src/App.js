import React, {useEffect, useState} from 'react';
import background from './images/background.jpg';
import {getWeatherData} from "./westherService";
import {
    ChakraProvider,
    Input,
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Modal, InputRightElement, InputGroup,
} from '@chakra-ui/react';
import MapComponent from "./components/Map";
import {WiStrongWind, WiBarometer} from 'react-icons/wi';
import {BsWater, BsThermometerHalf} from "react-icons/bs";
import {LuSunrise, LuSunset} from "react-icons/lu";

function App() {

    const [city, setCity] = useState('Redmond');
    const [stateCode, setStateCode] = useState('WA');
    const [inputCity, setInputCity] = useState('');
    const [inputStateCode, setInputStateCode] = useState('');
    const [weather, setWeather] = useState(null);
    const [units, setUnits] = useState('metric');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const data = await getWeatherData(city, stateCode, 'US', units);
                setWeather(data);
            } catch (error) {
                setModalMessage('Please check the city and state code.');
                onOpen();
            }
        };

        fetchWeatherData();
    }, [city, stateCode, units]);

    const handleCityChange = (event) => {
        setInputCity(event.target.value);
    };

    const handleStateCodeChange = (event) => {
        setInputStateCode(event.target.value);
    };

    const handleSubmit = () => {
        if (!inputCity || !inputStateCode) {
            const message = !inputCity ? 'Please enter the city.' : 'Please enter the state code.';
            setModalMessage(message);
            onOpen();
            return;
        }
        setCity(inputCity.trim());
        setStateCode(inputStateCode.trim());
        setInputCity('');
        setInputStateCode('');
    };


    const enterTap = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    const toggleUnits = () => {
        setUnits((prevUnits) => (prevUnits === 'metric' ? 'imperial' : 'metric'));
    };

    useEffect(() => {
        if (modalMessage) {
            console.log('Opening modal from useEffect');
            onOpen();
        }
    }, [modalMessage, onOpen]);

    const handleCloseModal = () => {
        setModalMessage('');
        onClose();
    };

    function convertUnixTimeTo12HourFormat(unixTime, timezoneOffset) {
        const date = new Date((unixTime + timezoneOffset) * 1000);

        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    }

    function getWindDirection(deg) {
        if (deg >= 0 && deg < 22.5) {
            return ' (N)';
        } else if (deg >= 22.5 && deg < 67.5) {
            return ' (NE)';
        } else if (deg >= 67.5 && deg < 112.5) {
            return ' (E)';
        } else if (deg >= 112.5 && deg < 157.5) {
            return ' (SE)';
        } else if (deg >= 157.5 && deg < 202.5) {
            return ' (S)';
        } else if (deg >= 202.5 && deg < 247.5) {
            return ' (SW)';
        } else if (deg >= 247.5 && deg < 292.5) {
            return ' (W)';
        } else if (deg >= 292.5 && deg < 337.5) {
            return ' (NW)';
        } else if (deg >= 337.5 && deg < 360) {
            return ' (N)';
        } else {
            return '';
        }
    }


    return (
        <ChakraProvider>
            <div className="App" style={{backgroundImage: `url(${background})`}}>
                <div className="overlay">
                    {weather && (
                        <div className="container">
                            <h1>
                                Check the weather in your city
                            </h1>
                            <div className="section section_input">
                                <InputGroup className="input-group" size="lg">
                                    <Input
                                        focusBorderColor="#FFFAF0"
                                        _placeholder={{color: 'inherit'}}
                                        type="text"
                                        sx={{height: '60px'}}
                                        placeholder="Enter City"
                                        value={inputCity}
                                        onChange={handleCityChange}
                                        onKeyPress={enterTap}
                                    />
                                </InputGroup>
                                <InputGroup className="input-group" size="lg">
                                    <Input
                                        focusBorderColor="#FFFAF0"
                                        _placeholder={{color: 'inherit'}}
                                        type="text"
                                        sx={{height: '60px'}}
                                        placeholder="Enter State or Country (ex.'WA')"
                                        value={inputStateCode}
                                        onChange={handleStateCodeChange}
                                        onKeyPress={enterTap}
                                    />
                                    <InputRightElement>
                                        <Button sx={{height: '58px', fontSize: '24px', marginTop: '12px'}}
                                                colorScheme="orange"
                                                onClick={toggleUnits}>
                                            °{units === 'metric' ? 'C' : 'F'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>

                            <div className='weather-content'>
                                <div className='all-sections'>
                                    <div className="section-weather">
                                        <div className="city-name">
                                            <h2>{weather.name} {weather.country}</h2>
                                            <div className='photoWeather'>
                                                <img src={weather.iconURL} alt="city image"/>
                                                <h2>{weather.main}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="section-weather">
                                        <div className='temperature'>
                                            <h2>
                                                <BsThermometerHalf/>
                                                {weather.temp.toFixed(1)}
                                                {units === 'metric' ? '°C' : '°F'}
                                            </h2>
                                            <h3>
                                                Feels like: {weather.feels_like.toFixed(1)}
                                                {units === 'metric' ? '°C' : '°F'}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="section-weather">
                                        <div className="humidity">
                                            <h2>
                                                <BsWater size={35} color="white" style={{margin: '10px'}}/>
                                                {weather.humidity}%
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="section-weather">
                                        <div className="wind-pressure">
                                            <h2>
                                                <WiStrongWind size={50} color="white"/>
                                                {weather.speed.toFixed(1)} {units === 'metric' ? 'm/s' : 'mph'}
                                                {getWindDirection(weather.deg)}
                                            </h2>
                                            <h2>
                                                <WiBarometer size={60} color="white"/>
                                                {weather.pressure}hPa
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="section-weather">
                                        <div className="sun">
                                            <h2>
                                                <LuSunrise size={35} color="white" style={{margin: '10px'}}/>
                                                {convertUnixTimeTo12HourFormat(weather.sunrise, weather.timezone)}
                                            </h2>
                                            <h2>
                                                <LuSunset size={35} color="white" style={{margin: '10px'}}/>
                                                {convertUnixTimeTo12HourFormat(weather.sunset, weather.timezone)}
                                            </h2>
                                        </div>

                                    </div>
                                    <div className="section-weather">
                                        <div className="UV-index">
                                            <h2>
                                                UV Index: {Math.round(weather.uvIndex)}
                                            </h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="section section_map">
                                    <MapComponent
                                        lat={weather.lat}
                                        lon={weather.lon}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <Modal isOpen={isOpen} onClose={handleCloseModal}>
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalHeader>Input Error</ModalHeader>
                            <ModalBody>
                                {modalMessage}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
