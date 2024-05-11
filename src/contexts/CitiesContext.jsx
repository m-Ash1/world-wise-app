import { createContext, useContext, useEffect, useState } from "react";

const context = createContext();
const BASE_URL = "http://localhost:5555";

// eslint-disable-next-line react/prop-types
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <context.Provider
      value={{
        cities,
        setCities,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </context.Provider>
  );
}

function useCities() {
  const cities = useContext(context);
  if (!cities) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return cities;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };

