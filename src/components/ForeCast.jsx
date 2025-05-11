import React from 'react'

const ForeCast = ({forecast}) => {

    // const Foreast = [
    //     { icon: '☀️', temperature: '24°', day: 'Monday', date: '5 May, 2025' },
    //     { icon: '☁️', temperature: '22°', day: 'Tuesday', date: '6 May, 2025' },
    //     { icon: '🌧️', temperature: '20°', day: 'Wednesday', date: '7 May, 2025' },
    //     { icon: '🌩️', temperature: '21°', day: 'Thursday', date: '8 May, 2025' },
    //     { icon: '🌤️', temperature: '23°', day: 'Friday', date: '9 May, 2025' },
    // ]

    // const hourlyForecast = [
    //     { time: '12:00 PM', icon: '☀️', temperature: '24°', windSpeed: '10 km/h' },
    //     { time: '1:00 PM', icon: '☀️', temperature: '25°', windSpeed: '12 km/h' },
    //     { time: '2:00 PM', icon: '☀️', temperature: '26°', windSpeed: '15 km/h' },
    //     { time: '3:00 PM', icon: '☀️', temperature: '27°', windSpeed: '18 km/h' },
    //     { time: '4:00 PM', icon: '☀️', temperature: '28°', windSpeed: '20 km/h' },
    //     { time: '5:00 PM', icon: '☀️', temperature: '29°', windSpeed: '22 km/h' },
    // ]
    const dailyForeCast = forecast.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString()
        if(!acc.find(f => f.date === date)) {
            acc.push({
                temperature: `${item.main.temp}°C`,
                day:new Date(item.dt * 1000).toLocaleDateString('en-EN', { weekday: 'short' }),
                date: date,
                icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
             
            })
        }
        return acc;
    }, []).slice(0,5)

    const hourlyForeCast = forecast.slice(0,6).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        temperature: `${item.main.temp}°C`,
        windSpeed: `${item.wind.speed} km/h`
    }))

    return (
        <div className='flex'>
            <div className='xl:w-96 w-full h-1/2 px-4 -y-4 bg-[#050e1fde] shadow-2xl shadow-black m-4 mt-10 rounded-lg text-white'>
                <h1 className='text-3xl font-bold mt-10 flex items-center justify-center'>5 Days Forecast:</h1>
                {dailyForeCast.map((cast, index) => (

                    <div key={index} className='flex flex-row justify-between items-center p-2'>
                        <img src={cast.icon} alt="icon" className='select-none w-16 h-16' />
                        <p className="font-bold text-center">{cast.temperature}</p>
                        <p className="font-bold">{cast.day}, {cast.date}</p>



                    </div>
                ))}

            </div>
            <div className='flex-grow h-auto px-4 -y-4 bg-[#050e1fde] shadow-2xl shadow-black m-4 mt-10 rounded-lg hidden lg:block text-white'>
                <h1 className='text-3xl font-bold mt-10 flex items-center justify-center'>Hourly Forecast</h1>
                <div className='flex justify-around items-center gap-2 h-54 mt-14'>
                    {hourlyForeCast.map((hourCast, index) => (
                        <div key={index} className='flex flex-col items-center gap-5 bg-[#1c2938] rounded-lg p-4 w-28 text-center shadow-md'>
                            <p className='text-sm font-medium'>{hourCast.time}</p>
                            <img src={hourCast.icon} alt="hourCastIcon" className='w-16 h-16 select-none' />
                            <p className='text-sm font-medium'>{hourCast.temperature}</p>
                            <p className='text-sm'>{hourCast.windSpeed}</p>
                        </div>
                    ))}
                </div>

            </div>

        </div> 
    )
}

export default ForeCast