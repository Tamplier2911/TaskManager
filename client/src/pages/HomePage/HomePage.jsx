import "./HomePage.scss";
import React from "react";

// components
import Form from "../../components/Form/Form.jsx";

const HomePage = () => {
  return (
    <section className="homepage">
      <h1 className="homepage__header">Tasks Manager</h1>
      <div className="homepage__formholder">
        <Form />
      </div>
    </section>
  );
};

export default HomePage;
