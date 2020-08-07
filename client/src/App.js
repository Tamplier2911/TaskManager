import "./App.scss";
import React, { useEffect } from "react";

// router
import { Switch, Route } from "react-router-dom";

// redux
import { useDispatch, useSelector } from "react-redux";
import { fetchUserObjectFromApi } from "./redux/auth/auth.actions";

// components
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Spinner from "./components/Spinner/Spinner.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";

// test
import bg from "./assets/jpg/paint-bg.jpg";

const App = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserObjectFromApi());
  }, []);

  const temporaryBgStyle = {
    backgroundImage: `linear-gradient(to bottom right, var(--cl-grad1), var(--cl-grad2)), url("${bg}")`,
  };

  return (
    <div className="container" style={temporaryBgStyle}>
      <Header />
      <main className="main">
        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={bg}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
        <Switch>
          <Route exact path="/" component={isLoading ? Spinner : HomePage} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
};

export default App;
