import React,{ useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  
  // State to store weather data
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Bhubaneswar');

  // State to store loading and error states
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState(null);

  // State to hold forecast data
  const [forecastData, setforecastData] = useState([]);

  // Detect Users Location using Geolocation
  const getCityFromCoords = async () => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: 'e23358e3c4c2969a6e698af7623ef645',
        }
      });
      if(res.data && res.data.length > 0){
        return res.data[0].name;
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
    return null;
  };

  // Fetch weather data
  const fetchWeather = async () => {
    if(!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try{
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: 'e23358e3c4c2969a6e698af7623ef645',
          units: 'metric',
        },
      });
      setWeatherData(res.data);
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  // Background change based on weather
  const getBackgroundClass = (weatherMain) => {
    switch(weatherMain){
      case 'Clear':return 'bg-blue-400';
      case 'Clouds': return 'bg-gray-400';
      case 'Rain': return 'bg-blue-700';
      case 'Thunderstorm': return 'bg-purple-800';
      case 'Snow': return 'bg-white';
      case 'Mist': return 'bg-gray-300';
      default: return 'bg-slate-600';
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async () => {
    try{
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: city,
          appid: 'e23358e3c4c2969a6e698af7623ef645',
          units: 'metric',
        },
      });
      // Get forecast for every 24 hours (every 8th item in 3-hour steps)
      const daily = res.data.list.filter((_, index) => index % 8 === 0);
      setForecastData(daily);
    } catch (err){
      console.error("Failed to fetch forecast", err);
    }
  };

  // Fetch weather data on initial load and whenever the city changes
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const detectedCity = await getCityFromCoords(latitude, longitude);
      if(detectedCity){
        setCity(detectedCity);
        await fetchWeather(detectedCity);
        await fetchForecast(detectedCity);
      }
    },
    async (error) => {
      console.warn("Geolocation permission denied, using default city.");
      await fetchWeather(city);
      await fetchForecast(city);
    });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
      fetchForecast();
    }
  };

  const handleSearch = () => {
    fetchWeather();
    fetchForecast();
  };

  return (
    <div className={`p-8 min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 ${getBackgroundClass(weatherData?.weather[0]?.main)}`}>
      <h1 className="text-3xl font-semibold mb-6">
        Weather Application 🌤️ 
      </h1>

    <div className="flex gap-4 mb-4">
      {/* Input to change the city */}
      <input 
        type="text" 
        value={city} 
        onChange={(e) => setCity(e.target.value)}
        spellCheck="false"
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Enter City"
      />
      <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
    </div>
      {/* Display weather or loading/error message */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 text-blue-400">
          <svg className="animate-spin h-6 w-6 text-blue-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Fetching weather data...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {/*Displaying Fetched data*/}
      {weatherData && !loading && !error &&(
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-72">
          <h2 className="text-2xl font-semibold mb-2">{weatherData.name}</h2>
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt="weather-icon" 
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="capitalize text-gray-600 mb-1">{weatherData.weather[0].description}</p>
          <p className="text-lg">🌡️ {weatherData.main.temp}°C</p>
          <p className="text-sm text-gray-500">
            Feels like: {weatherData.main.feels_like}°C
          </p>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecastData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow text-center">
              <p className="font-semibold">{new Date(item.dt_txt).toLocaleDateString()}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
                alt="icon" 
                className="mx-auto w-12 h-12"
              />
              <p>{item.weather[0].main}</p>
              <p>{item.main.temp}°C</p>
            </div>
          ))}
        </div>
      )}
    </div> 
  );
};

export default App;