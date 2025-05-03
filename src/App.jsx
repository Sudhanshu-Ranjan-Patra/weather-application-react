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
    setLoading(true);
    setError(null);

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
      setError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data on initial load and whenever the city changes
  useEffect(() => {
    fetchWeather();
  }, [city]);

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-6">
        Weather Application 🌤️
      </h1>

      {/* Input to change the city */}
      <input 
        type="text" 
        value={city} 
        onChange={(e) => setCity(e.target.value)}
        spellCheck="false"
        className="border border-gray-300 p-2 mb-4" 
        placeholder="Enter City"
      />

      {/* Display weather or loading/error message */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weatherData && !loading && !error &&(
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl">{weatherData.name}</h2>
          <p className="text-xl">{weatherData.weather[0].description}</p>
          <p className="text-lg">Temperature: {weatherData.main.temp}°C</p>
        </div>
      )}
    </div>
  );
};

export default App;