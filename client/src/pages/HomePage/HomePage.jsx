import "./HomePage.scss";
import React from "react";

// redux
import { useSelector } from "react-redux";

// components
import FormHolder from "../../components/FormHolder/FormHolder.jsx";

const HomePage = () => {
  const { userObject } = useSelector((state) => state.auth);

  return (
    <section className="homepage">
      <h1 className="homepage__header">Tasks Manager</h1>

      {userObject ? (
        <div className="homepage__tasksholder">Tasks</div>
      ) : (
        <div className="homepage__formholder">
          <FormHolder />
        </div>
      )}
    </section>
  );
};

export default HomePage;
