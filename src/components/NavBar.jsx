import React from 'react'
import logo from '../assets/logo.png'
import search from '../assets/search.png'
import location from '../assets/currentlocationicon.png'
import { toast } from 'react-toastify'

const NavBar = ({ onCitySearch, onLocationFetch }) => {

    const [searchQuery, setSearchQuery] = React.useState('')
    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery) {
            onCitySearch(searchQuery)
        }
    }

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                onLocationFetch(latitude, longitude);
                setSearchQuery('')
            }, (error) => {
                console.error("Error getting location: ", error);
                toast.error("Unable to retrieve your location. Geolocation is not supported by your browser. Please check your browser settings."); {/* Geolocation is not supported by the browser */ }
            });
        }
    }
    return (
        <div className='m-4'>
            <div className='flex flex-col items-center justify-between gap-4 lg:flex-row'>
                {/*logo*/}
                <div className='flex items-center gap-2'>
                    <img src={logo} alt="logo" className='w-12 select-none' />
                    <span className='text-3xl font-semibold text-blue-50'>Weather App</span>
                </div>
                {/* search bar */}
                <form onSubmit={handleSearchSubmit} className='relative flex items-center w-full max-w-md bg-white rounded-lg shadow-md'>
                    <img src={search} alt="search" className='absolute left-3 w-4 h-4 text-gray-400 select-none' />

                    <input type="text"
                        value={searchQuery}
                        onChange={handleSearchQuery}
                        placeholder="Search for your preferrable city..." className="w-full py-2 pl-10 pr-4 text-md text-gray-700 placeholder-gray-400 border-none outline-none" />
                    <button className='bg-[#050e1fde] text-white px-5 py-2'>
                        Search
                    </button>
                </form>
                <div onClick={handleLocationClick} className="flex items-center gap-3 px-4 text-sm font-medium text-white bg-green-500 rounded cursor-pointer hover:bg-green-600 transition duration-300 ease-in-out">
                    <img src={location} alt="location" className='w-10 h-10' />
                    <p className='text-xl'>Current Location</p>
                </div>
            </div>
        </div>
    )
}

export default NavBar