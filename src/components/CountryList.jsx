import { useCities } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
const CountryList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  const countries = cities.reduce((array, city) => {
    if (array.map((el) => el.country).includes(city.country)) return array;
    else return [...array, { country: city.country, emoji: city.emoji }];
    // return [...array, { country: city.country, emoji: city.emoji }]; //? Lw 3awz A extract ay 7aga mn el city object
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} emoji={country.emoji} key={i} />
      ))}
    </ul>
  );
};

export default CountryList;
