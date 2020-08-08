import "./LoginForm.scss";
import React, { useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { logUserInWithEmailAndPassword } from "../../redux/auth/auth.actions";

// components
import TextInput from "../TextInput/TextInput.jsx";
import Button from "../Button/Button.jsx";

// svgs
import EmailSVG from "../../assets/svg/emails.svg";
import PasswordSVG from "../../assets/svg/passwords.svg";

const LoginForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userCredentials;

  const onSubmit = (e) => {
    e.preventDefault();
    // validate and send to moon
    dispatch(logUserInWithEmailAndPassword(userCredentials));
    setUserCredentials({
      email: "",
      password: "",
    });
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="loginform">
      <form
        className="loginform__element"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextInput
          onChange={onInputChange}
          name="email"
          value={email}
          label="Email"
          type="email"
          Logo={EmailSVG}
          id={"email-loginform"}
          required
        />
        <TextInput
          onChange={onInputChange}
          name="password"
          value={password}
          label="Password"
          type="password"
          Logo={PasswordSVG}
          id={"password-loginform"}
          required
        />
        <Button
          title={isLoading ? "Processing..." : "Login"}
          type="submit"
          active={isLoading ? 0 : 1}
        />
      </form>
    </div>
  );
};

export default LoginForm;
