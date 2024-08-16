import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import ForeCast from "./components/ForeCast";
import getFormattedWeatherData from "./services/weatherService";

// Import Spinner
import Spinner from "./components/Spinner";
import LineChart from "./LineChart";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {
  const [query, setQuery] = useState({});
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");

  const [temperature, setTemperature] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [thresholds, setThresholds] = useState({
    temp: 20, // Default threshold for temperature in Celsius
    condition: "Rain" // Default threshold for specific weather conditions
  });
  const checkThresholds = () => {
    if (!weather) return;
    if (temperature) {
      const tempExceeded = weather.temp > parseInt(temperature, 10);
      if (tempExceeded) {
        console.log(`Alert: Temperature exceeds ${thresholds.temp}°C`);
        toast.warn(`Alert: Temperature exceeds ${thresholds.temp}°C`);
        //alert(`Alert: Temperature exceeds ${thresholds.temp}°C`)
      }
    }
    if (weatherCondition) {
      const conditionMatched = weather.details === weatherCondition;

      if (conditionMatched) {
        console.log(`Alert: Weather condition matches ${thresholds.condition}`);
        toast.warn(`Weather condition matches ${thresholds.condition}!`);
      }
    }
  };
  useEffect(() => {
    if (weather) {
      generateSummary();
    }
  }, [weather]);


  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";

    try {
      const data = await getFormattedWeatherData({ ...query, units });
      setWeather(data);
    } catch (error) {
      toast.error(`Failed to fetch weather data for ${capitalizeFirstLetter(cityName)}`);
      console.error("Weather fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setQuery({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setQuery({ q: "Nagpur" });
        }
      );
    } else {
      setQuery({ q: "Nagpur" });
    }
  }, []);

  useEffect(() => {
    if ((query.lat && query.lon) || query.q) {
      setLoading(true);
      getWeather();
    }
  }, [query, units]);

  const tempRanges = [
    { min: -10, max: 0, desc: "Extreme cold alert! Today will be very cold.It's important to limit time outdoors as much as possible. If you must go outside, bundle up in multiple layers, including a thermal base layer, thick coat, hat, gloves, and a scarf. Watch for signs of frostbite, especially on exposed skin, and take frequent breaks indoors to warm up. Stay safe by avoiding icy roads and walkways, and consider staying indoors if the conditions are severe. If you have elderly neighbors or vulnerable individuals nearby, check on them to ensure they are safe and warm." },
    { min: 1, max: 10, desc: "It's going to be a cold day with minimum of 1 degree.Make sure to dress warmly in layers, including a hat, gloves, and a scarf to protect against the cold.If you plan to be outdoors, keep an eye on the wind chill and take breaks indoors to stay warm.Be cautious on icy or snowy surfaces, and consider indoor activities if the cold is too harsh." },
    { min: 11, max: 20, desc: "Today will be a mild day with maximum temperature of 20.The weather is comfortable and ideal for a variety of activities, both indoors and outdoors. It's a great day for a walk, a bike ride, or simply enjoying time outside. You won't need to worry too much about heat or cold, but it's always good to have a light jacket or sweater handy, especially in the early morning or evening." },
    { min: 21, max: 30, desc: "It's going to be a warm day. Enjoy the pleasant weather, but remember to stay hydrated and wear sunscreen if you're spending time outdoors.Light, breathable clothing will help you stay comfortable, and it's a great day for outdoor activities. If you're sensitive to the sun, seek shade during the hottest parts of the day, and consider wearing a hat and sunglasses." },
    { min: 31, max: 40, desc: "It's going to be a hot day.Make sure to stay hydrated, avoid prolonged sun exposure, and wear light, loose-fitting clothing. If you have to go outside, try to stay in the shade as much as possible and take frequent breaks indoors." },
    {
      min: 41, max: 50, desc: "Extreme heat alert! Today is going to be very hot day with 35 degree+.It's crucial to stay indoors as much as possible. Keep yourself hydrated by drinking plenty of water, and avoid outdoor activities during peak sunlight hours(10 AM to 4 PM). If you must go outside, wear sunscreen, protective clothing, and a wide- brimmed hat. Keep an eye out for signs of heat exhaustion, such as dizziness, nausea, and excessive sweating. Never leave children or pets in a parked car."
    }
  ];

  const weatherConditions = {
    "Mist": "Expect cool weather with misty conditions. Visibility may be significantly reduced, so drive carefully and keep an eye out for pedestrians. It's a good idea to stay indoors if possible, and if you do go outside, wear warm clothing and be cautious of potentially slippery surfaces.",
    "Clear": "Expect mild weather with clear skies. It's a perfect day to enjoy outdoor activities.",
    "Clouds": "Expect overcast skies. A great day for indoor activities or a walk with a light jacket, also chances of rain.",
    "Haze": "Expect mild weather with hazy skies. Visibility may be reduced, so take it easy while outdoors and consider staying hydrated.",
    "Rain": "Expect cool weather with rain showers. Remember to carry an umbrella or raincoat and be cautious of wet and slippery surfaces. ",
    "thunderstorm": "Expect cool weather with thunderstorms. Seek shelter indoors and avoid using electrical appliances. Stay away from tall objects and open fields.",
    "snowy": "Expect cold weather with snowfall. Ensure you dress warmly in layers, and be cautious of slippery roads and sidewalks. If traveling, allow extra time and drive safely."
  };
  useEffect(() => {
  }, [summary]);

  const generateSummary = () => {
    if (!weather) return; // Return early if weather data is not available

    const tempDesc = tempRanges.find(range => weather.temp >= range.min && weather.temp <= range.max)?.desc || "temperate";
    const conditionDesc = weatherConditions[weather.details] || "variable conditions";

    const hourlySummary = weather.hourly.map((hour, index) => {
      const hourText = index === 0 ? 'Currently' : `In ${index} hour${index > 1 ? 's' : ''}`;
      return `${hourText}: ${hour.temp}°C`;
    }).join(". ");

    const summaryText = `Expect ${tempDesc} ${conditionDesc}. ${hourlySummary}.`;
    setSummary(summaryText);
  };

  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700";
    console.log(weather)
    const { details } = weather;

    switch (details) {
      case "Clear":
        return "from-yellow-400 to-orange-700";
      case "Clouds":
        return "from-gray-400 to-gray-800";
      case "Rain":
        return "from-blue-400";
      case "Snow":
        return "from-blue-400 to-blue-200";
      case "Mist":
        return "from-yellow-100 to-orange-700";
      case "Haze":
        return "from-purple-400 to-purple-700";
      case "Thunderstorm":
        return "from-yellow-300 to-gray-700";
      case "Drizzle":
        return "from-green-400 to-blue-700";
      case "Smoke":
        return "from-gray-300 to-gray-500";
      default:
        return "from-cyan-600 to-blue-700";
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    checkThresholds()
    console.log('Temperature:', temperature);
    console.log('Weather Condition:', weatherCondition);
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      getWeather();
      checkThresholds();

    }, 300000); // 300000 milliseconds = 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    summary1: "",
    city:""
});

const handleSubmit1 = async (e) => {
    e.preventDefault();
    setFormData({
      date:weather.formattedLocalTime,
      summary1:summary,
      city:weather.name
    })
    console.log(formData)

    try {
        const response = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the error message
            throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        toast.success(`Summary saved to database`);

    } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., show error message)
        toast.error(`Summary not saved to database`);
    }
};
  return (
    <>
      <h1 className="text-center font-extrabold text-2xl lg:text-1xl text-gray-900 p-1">
  Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates
</h1>

      <div className="outer-div flex justify-between mx-3">
        {/* Left Side Div */}
        <div className="left-div w-3/4 mr-4">
          <div
            className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <TopButtons setQuery={setQuery} />
                <Inputs setQuery={setQuery} setUnits={setUnits} />
                {weather && (
                  <>
                    <TimeAndLocation weather={weather} />
                    <TempAndDetails weather={weather} units={units} />
                    <ForeCast
                      title="3 hour step forecast"
                      data={weather.hourly}
                    />
                    <ForeCast title="daily forecast" data={weather.daily} />
                  </>
                )}
              </>
            )}
            <ToastContainer
              autoClose={1500}
              hideProgressBar={true}
              theme="colored"
            />
          </div>
        </div>

        {/* Right Side Div */}
        <div className="right-div flex-1 ml-4 mt-12">
          <div className="flex items-center justify-center bg-gray-100">
            <div className="flex items-center justify-between w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 self-center">Threshold</h2>
              <form onSubmit={handleSubmit} className="ml-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    placeholder="Enter temperature"
                    value={temperature}
                    required
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    id="weatherCondition"
                    name="weatherCondition"
                    placeholder="Enter Weather Condition"
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <button className="p-3 bg-blue-500 mt-4 text-white rounded-md shadow-md hover:bg-blue-600 " onClick={handleSubmit1}>
            Click to Save summary
          </button>
          <h1 className="p-3 text-black rounded-md shadow-md mr-3 mt-8">
            {summary}
          </h1>
          <LineChart value={weather} />
        </div>
      </div>
    </>
  );
};

export default App;
