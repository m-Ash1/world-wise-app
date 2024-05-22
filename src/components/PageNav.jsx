import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import Logo from "./Logo";
import styles from "./PageNav.module.css";
const PageNav = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <NavLink
              to={"/app"}
            >
              Go To App
            </NavLink>
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default PageNav;
