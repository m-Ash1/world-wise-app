import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { lat, lng } = useUrlPosition();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { createCity, isLoading } = useCities();

  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchCityName() {
      try {
        setIsLoadingLocation(true);
        setError("");
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();

        if (!data.countryCode) throw new Error("Click Somewhere Else!");

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoadingLocation(false);
      }
    }
    fetchCityName();
  }, [lat, lng]);

  async function submitHandler(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity); // wait for the city to be created before navigating to avoid unexpected behavior
    navigate("/app/cities");
  }
  if (isLoadingLocation) return <Spinner />;
  if (!lat || !lng) return <Message message="Click Somewhere on the Map" />;
  if (error) return <Message message={error} />;
  return (
    <form
      className={`${styles.form} ${isLoading && styles.loading}`}
      onSubmit={submitHandler}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={"dd/MM/YYY"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
