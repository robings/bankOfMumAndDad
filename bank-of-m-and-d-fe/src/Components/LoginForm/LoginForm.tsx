import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiUser from "../../api/apiUser";
import { ILoginDto } from "../../Interfaces/Entities/ILoginDto";
import { ILoginProps } from "../../Interfaces/Props/ILoginProps";
import { revokeToken, setToken } from "../../tokenHelper/tokenHelper";

function LoginForm(props: ILoginProps): JSX.Element {
  const [loginFormInput, setLoginFormInput] = useState<ILoginDto>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value && e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#107C10";
    } else if (e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#E81123";
    }
    setLoginFormInput({
      ...loginFormInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginFormInput.username || !loginFormInput.password) {
      toast.error("Please fill in missing data");
    } else {
      submitLogin(loginFormInput);
    }
  }

  async function submitLogin(loginFormInput: ILoginDto) {
    await apiUser
      .login(loginFormInput)
      .then((response) => {
        setToken(response.token);
        props.setLoginMessage({ status: "success", message: "" });
      })
      .catch(() => {
        revokeToken();
      });
  }

  return (
    <div className="overlay">
      <div className="modal">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              className="redBorder"
              type="text"
              name="username"
              id="username"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className="redBorder"
              type="password"
              name="password"
              id="password"
              onChange={handleInputChange}
            />
          </div>
          <input className="appButton" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
