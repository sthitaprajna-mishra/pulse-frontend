import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Unauthorized from "./components/Auth/Unauthorized";
import Error404 from "./components/Auth/Error404";
import CreatePost from "./components/Home/CreatePost";

const ROLES = {
  User: "65dd69c6-9b6e-4414-9b88-0e4f8bc2aa9d",
  Admin: "111b7588-af1b-42a7-9556-245c3c60830c",
};

function App() {
  const isAuthenticated = !!localStorage?.getItem("accessToken");

  console.log(`${isAuthenticated ? "logged in" : "logged out"}`);

  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* protected routes */}
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          {/* <Route path="/post" element={<CreatePost />} /> */}
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}

      <Route path="/*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
