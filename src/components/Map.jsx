import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import styles from "./Map.module.css";
const Map = () => {
  const { lat, lng } = useUrlPosition();
  const navigate = useNavigate();
  const [mapPosition, setMapPosition] = useState([30, 31]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);
  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      navigate(
        `form?lat=${geoLocationPosition.lat}&lng=${geoLocationPosition.lng}`
      );
    }
  }, [geoLocationPosition]);
  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button
          type="position"
          onClick={() => {
            getPosition();
          }}
        >
          {isLoadingPosition ? "Loading..." : "Use my location"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>{city.cityName}</Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
export default Map;
