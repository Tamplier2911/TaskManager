import "./FormHolder.scss";
import React, { useState } from "react";

// svg
import ArrowLog from "../../assets/svg/arrowlog.svg";

// forms
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import SignupForm from "../../components/SignupForm/SignupForm.jsx";

const FormHolder = () => {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  return (
    <div className="formholder">
      <div className="formholder__switch">
        <div
          className="formholder__switch--text"
          onClick={() => setDisplayLoginForm(!displayLoginForm)}
        >
          {displayLoginForm ? "Signup" : "Login"}
        </div>
        <div className="formholder__switch--svgwrap">
          <ArrowLog className="formholder__switch--svg" />
        </div>
      </div>
      <div className="formholder__form">
        {displayLoginForm ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default FormHolder;
