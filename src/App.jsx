import React,{ useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  
  // State to store weather data
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Bhubaneswar');

  // State to store loading and error states
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState(null);

  // Fetch weather data
  const fetchWeather = async () => {
    if(!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try{
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: 'e23358e3c4c2969a6e698af7623ef645',
          units: 'metric',
        },
      });
      setWeatherData(response.data);
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data on initial load and whenever the city changes
  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="p-8 bg-blue-800 min-h-screen flex flex-col items-center justify-center">
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
          onClick={fetchWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
    </div>
      {/* Display weather or loading/error message */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weatherData && !loading && !error &&(
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-72">
          <h2 className="text-2xl font-semibold mb-2">{weatherData.name}</h2>
          <p className="capitalize text-gray-600 mb-1">{weatherData.weather[0].description}</p>
          <p className="text-lg">🌡️ {weatherData.main.temp}°C</p>
          <p className="text-sm text-gray-500">
            Feels like: {weatherData.main.feels_like}°C
          </p>
        </div>
      )}
    </div> 
  );
};

export default App;