import React, { useEffect, useState } from "react";

// import styled
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

// route
import { Routes, Route, Navigate } from "react-router-dom";

// utils
import { ToastContainer } from "react-toastify";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Sign from "./pages/Sign";
import RecommendedBooks from "./pages/RecommendedBooks";
import Profile from "./pages/Profile";
import Book from "./pages/Book";
import About from "./pages/About";
import BookDescriptionGenerator from "./pages/findBook";
import MostPopular from "./pages/mostPopular";
// components
import Loading from "./components/Loading";

// API
import API from "./utils/API";

// cookies
import cookie from "react-cookies";

// context
import UserContext from "./utils/context/UserContext";

const App = () => {
  const [userData, setUserData] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = cookie.load("token");

    if (!token) {
      setIsLoading(false);
      return setIsLogin(false);
    }

    API(`/default/UserInfoById?profile=false&token=${token}`).then(
      ({ data }) => {
        if (data.code == 200) {
          setIsLogin(true);
          setUserData(data.Data);
        }
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : isLogin ? (
        <UserContext.Provider value={userData}>
          <Routes>
          <Route index path="/findBook" element={<BookDescriptionGenerator />} />
            <Route index path="/about" element={<About />} />
            <Route index path="/MostPopular" element={<MostPopular />} />
            <Route index path="/" element={<Home />} />
            <Route path="/RecommendedBooks" element={<RecommendedBooks />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/book/:id" element={<Book />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </UserContext.Provider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
