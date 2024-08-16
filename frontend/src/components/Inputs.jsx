import { useState } from "react";
import { BiCurrentLocation, BiSearch } from "react-icons/bi";

const Inputs = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState("");

  const handleSearchClick = () => {
    if (city !== "") {
      setQuery({ q: city });
      setCity("");
    } 
  };

  const handleGeoClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setQuery({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4 mx-11">
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="search by city..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase"
        />
        <BiSearch
          size={32}
          className="cursor-pointer ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <BiCurrentLocation
          size={32}
          className="cursor-pointer ease-out hover:scale-125"
          onClick={handleGeoClick}
        />
      </div>

      <div className="flex flex-row w-1/4 items-center justify-center">
        <button
          className="text-2xl font-medium transition ease-out hover:scale-125"
          onClick={() => setUnits("metric")}
        >
          °C
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button
          className="text-2xl font-medium transition ease-out hover:scale-125"
          onClick={() => setUnits("imperial")}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
