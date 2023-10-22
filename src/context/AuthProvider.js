// AuthContext.js
import { createContext, useState } from "react";

const AuthContext = createContext({
  auth: {},
  setAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  console.log("auth in AuthProvider:", auth); // Add this line to check the auth value

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
