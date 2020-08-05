import "./Button.scss";
import React from "react";

const Button = ({ title, active, action = () => {}, type = "button" }) => {
  return (
    <div className="button">
      <button
        className={`button__element ${active ? "" : "button__disabled"}`}
        onClick={action}
        type={type}
        {...(active ? {} : { disabled: true })}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;
