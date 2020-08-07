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

const App = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserObjectFromApi());
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main">
        <Switch>
          <Route exact path="/" component={isLoading ? Spinner : HomePage} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
};

export default App;
