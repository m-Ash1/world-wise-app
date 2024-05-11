import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import Button from "./Button";
const Map = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      Position: lat:{lat} lng:{lng}
      <Button type="position" onClick={() => navigate("form")}>
        use my location
      </Button>
    </div>
  );
};

export default Map;
