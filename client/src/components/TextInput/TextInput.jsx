import "./TextInput.scss";
import React from "react";

const TextInput = ({ Logo, label, id, ...otherProps }) => {
  return (
    <div className="textInput">
      <input className="textInput__element" {...otherProps} id={id} />
      <div className="textInput__fillbar"></div>
      {label ? (
        <label className="textInput__label" htmlFor={id}>
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
