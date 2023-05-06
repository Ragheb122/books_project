import React from "react";

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
import ForgetPassword from "./pages/ForgetPassword";
import Books from "./pages/Books";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Book from "./pages/Book";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/book/:id" element={<Book />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
