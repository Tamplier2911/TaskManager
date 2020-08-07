import "./Spinner.scss";
import React from "react";

// svg
import SandWatchSVG from "../../assets/svg/time-and-date.svg";

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner__element">
        <SandWatchSVG className="spinner__element--svg" />
      </div>
    </div>
  );
};

export default Spinner;
