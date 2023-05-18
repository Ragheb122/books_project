import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Accounts from "./pages/Accounts";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import GiftCards from "./pages/GiftCards";
import Categories from "./pages/Categories";

import Loading from "./components/Loading";
import API from "./utils/API";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// cookies
import cookie from "react-cookies";
import AdminData from "./utils/context/AdminData";
// import "moment/locale/ar";

const App = () => {
  const [adminData, setAdminData] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = cookie.load("token");

    if (!token) {
      return setIsLoading(true);
    }

    API(`/default/UserInfoById?token=${token}&profile=true`)
      .then(({ data }) => {
        if (data?.code === 200) setIsLogin(true);

        console.log(data?.code);
        setIsLoading(true);
        setAdminData(data?.Data);
      })
      .catch((err) => {
        setIsLoading(true);
      });
  }, []);

  return (
    <div className="App">
      <ToastContainer />

      <AdminData.Provider value={adminData}>
        {!isLoading ? (
          <Loading />
        ) : (
          <Routes>
            {isLoading && isLogin ? (
              <>
                <Route path="/" element={<Accounts />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : isLoading && !isLogin ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              ""
            )}
          </Routes>
        )}
      </AdminData.Provider>
    </div>
  );
};

export default App;
