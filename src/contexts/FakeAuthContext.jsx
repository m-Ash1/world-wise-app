import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USERS = [
  {
    name: "Ash",
    email: "ash@gmail.com",
    password: "2702",
    avatar: "https://i.pravatar.cc/100?u=zz",
  },
  {
    name: "Dodo",
    email: "dodo@gmail.com",
    password: "1602",
    avatar: "https://i.pravatar.cc/100?u=f",
  },
];
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error(`Unsupported action type ${action.type}`);
  }
}
const initialState = {
  user: null,
  isAuthenticated: false,
};
function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    FAKE_USERS.forEach((user) => {
      if (user.email === email && user.password === password) {
        console.log("Logged in");
        dispatch({ type: "login", payload: user });
      }
    });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };

