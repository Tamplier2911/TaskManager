import "./TextInput.scss";
import React from "react";

const TextInput = ({ Logo, label, ...otherProps }) => {
  return (
    <div className="textInput">
      <input className="textInput__element" {...otherProps} />
      <div className="textInput__fillbar"></div>
      {label ? (
        <label className="textInput__label">
          <div className="textInput__label--svgwrap">
            {Logo ? <Logo className="textInput__label--svg" /> : null}
          </div>
          <div className="textInput__label--text">{label}</div>
        </label>
      ) : null}
    </div>
  );
};

export default TextInput;
