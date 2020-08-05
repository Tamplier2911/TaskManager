import "./Header.scss";
import React from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { logUserOutAndCleanState } from "../../redux/auth/auth.actions";

const Header = () => {
  const { userObject } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <header className="header">
      <div className="header__content">
        {userObject ? (
          <div
            className="header__content--logout"
            onClick={() => dispatch(logUserOutAndCleanState())}
          >
            Logout
          </div>
        ) : (
          <div className="header__content--text"></div>
        )}
      </div>
    </header>
  );
};

export default Header;
