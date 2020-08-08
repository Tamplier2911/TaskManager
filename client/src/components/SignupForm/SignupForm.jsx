import "./SignupForm.scss";
import React, { useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { signUpUserWithEmailAndPassword } from "../../redux/auth/auth.actions";

// components
import TextInput from "../TextInput/TextInput.jsx";
import Button from "../Button/Button.jsx";

// svgs
import EmailSVG from "../../assets/svg/emails.svg";
import PasswordSVG from "../../assets/svg/passwords.svg";
import UserSVG from "../../assets/svg/usernames.svg";

const SignupForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { name, email, password, passwordConfirm } = userCredentials;

  const onSubmit = (e) => {
    e.preventDefault();
    // validate and send to moon
    dispatch(signUpUserWithEmailAndPassword(userCredentials));
    // clean fields
    setUserCredentials({
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="signupform">
      <form
        className="signupform__element"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextInput
          onChange={onInputChange}
          name="name"
          value={name}
          label="Name"
          type="text"
          Logo={UserSVG}
          id={"name-signupform"}
          required
        />
        <TextInput
          onChange={onInputChange}
          name="email"
          value={email}
          label="Email"
          type="email"
          Logo={EmailSVG}
          id={"email-signupform"}
          required
        />
        <TextInput
          onChange={onInputChange}
          name="password"
          value={password}
          label="Password"
          type="password"
          Logo={PasswordSVG}
          id={"password-signupform"}
          required
        />
        <TextInput
          onChange={onInputChange}
          name="passwordConfirm"
          value={passwordConfirm}
          label="Confirm Password"
          type="password"
          Logo={PasswordSVG}
          id={"passwordconfirm-signupform"}
          required
        />
        <Button
          title={isLoading ? "Processing..." : "Signup"}
          type="submit"
          active={isLoading ? 0 : 1}
        />
      </form>
    </div>
  );
};

export default SignupForm;
