import React, { useState, useEffect } from 'react';
// import sun from '../assets/sun.png'
import Clock from './Clock'
import sunrise from '../assets/sunrise.png'
import sunset from '../assets/sunset.png'
// import sunny from '../assets/sun.png'
import humidity from '../assets/humidity.png'
import windspeed from '../assets/wind.png'
import airpressure from '../assets/airpressure.png'
import uv from '../assets/uv.png'
import ForeCast from './ForeCast'
import { toast } from 'react-toastify'
import axios from 'axios'
import ReactAnimatedWeather from 'react-animated-weather';
import iconMap from './iconMapper'; 


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const CityAndTime = ({ cityName, lat, lon, setLat, setLon }) => {

    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [uvIndex, setUvIndex] = useState(null);

    const fetchData = async (latitude = lat, longitude = lon) => {
        try {
            const encodedCity = encodeURIComponent(cityName);
            let url;
            if (encodedCity) {
                url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`;
            } else if (latitude && longitude) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
            } else {
                toast.error("No city or location provided");
            }

            const currentWeather = await axios.get(url);
            setWeatherData(currentWeather.data);
            console.log("Current icon:", currentWeather.data.weather[0].icon);


            const { coord } = currentWeather.data;
            setLat(coord.lat);
            setLon(coord.lon);

            const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${API_KEY}`);
            setForecastData(forecast.data);

            const uv = await axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`);
            setUvIndex(uv.data.value);

        } catch (error) {
            console.error("Error fetching weather data:", error); {/* API error */ }
        }
    }

    useEffect(() => {
        if (!cityName && (!lat || !lon)) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLat(latitude)
                    setLon(longitude)
                    fetchData(latitude, longitude)
                },
                (error) => {
                    console.error("Error getting location:", error); {/* geolocation error */ }
                    toast.error("Unable to retrieve location. Please enter a city name.");
                }
            )
                } else {
                    fetchData(lat, lon);
                }
            }, [cityName, lat, lon]);
        


    if (!weatherData || !forecastData) {
        return <div className='flex justify-center items-center text-white text-3xl md:text-6xl'>Loading...</div>;
    }

    const { main, weather, wind, sys } = weatherData;
    const { list } = forecastData;

    // const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

    const iconCode = weather[0].icon;  // e.g., "01d"
const animatedIcon = iconMap[iconCode] ||  { icon: 'CLOUDY', color: 'white' };

    return (
        <>
            <div className="flex flex-col xl:flex-row gap-4 mt-10">
                {/* Left section: city and time */}
                <div className="w-full xl:w-1/3 h-auto md:h-72 bg-[#050e1fde] shadow-2xl shadow-black rounded-lg text-white p-4 flex flex-col justify-between items-center">
                    <h1 className='text-3xl md:text-4xl font-bold'>
                        {cityName || weatherData.name}
                    </h1>
                    {/* <img src={weatherIconUrl} alt={weather[0].description} className='w-35 select-none'   /> */}
                    <ReactAnimatedWeather icon={animatedIcon.icon} color={animatedIcon.color} size={70} animate={true} />
                    <Clock />
                </div>
                {/* Right section: weather details */}
                <div className='flex-grow h-auto md:h-72 bg-[#050e1fde] shadow-2xl shadow-black rounded-lg text-white p-4 flex flex-col justify-around md:flex-row items-center md:items-stretch gap-4 '>
                    {/* Temperature and Sunrise and Sunset */}
                    <div className='flex flex-col items-center justify-between xl:justify-center gap-6 md:gap-4'>
                        <h1 className='text-5xl md:text-7xl font-bold'>{main.temp}&#8451;</h1>
                        <p className='text-center'>
                            Feels like: <span className='text-lg md:text-xl ml-2 font-bold'>{main.feels_like}&#8451;</span>
                        </p>
                        <div className='flex xl:flex-col md:flex-row items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <img src={sunrise} alt="sunrise" className='h-8 md:h-10 select-none' />
                                <div className='text-center'>
                                    <h6>Sunrise</h6>
                                    <p>{new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <img src={sunset} alt="sunset" className='h-8 md:h-10 select-none' />
                                <div className='text-center'>
                                    <h6>Sunset</h6>
                                    <p>{new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Main Weather Icons */}
                    <div className='flex flex-col justify-center items-center'>
                        {/* <img src={weatherIconUrl} alt={weather[0].description} className='w-36 h-36 md:w-52 md:h-52 select-none' /> */}
                        <ReactAnimatedWeather icon={animatedIcon.icon} color={animatedIcon.color} size={96} animate={true} />
                        <p className='font-bold text-lg md:text-3xl'>{weather[0].description}</p>
                    </div>
                    {/* Additional Weather Information */}
                    <div className='md:grid md:grid-cols-2 flex flex-row justify-between gap-4 md:p-4'>
                        <div className='flex flex-col items-center gap-2'>
                            <img src={humidity} alt="humidity" className='h-8 md:h-10 select-none' />
                            <p>{main.humidity}%</p>
                            <h6>Humidity</h6>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <img src={windspeed} alt="Wind Speed" className='h-8 md:h-10 select-none' />
                            <p>{wind.speed}km/hr</p>
                            <h6>Wind Speed</h6>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <img src={airpressure} alt="air pressure" className='h-12 md:h-14 select-none' />
                            <p>{main.pressure}hPa</p>
                            <h6 >Air Pressure</h6>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <img src={uv} alt="uv" className='h-12 md:h-14 select-none' />
                            <p>{uvIndex !== null ? uvIndex : 'N/A'}</p>
                            <h6>UV</h6>
                        </div>
                    </div>

                </div>
            </div>
            <ForeCast forecast={list} />
        </>
    )
}

export default CityAndTime