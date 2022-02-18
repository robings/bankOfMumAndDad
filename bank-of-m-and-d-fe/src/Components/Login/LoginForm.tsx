import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import { useState } from "react";
import * as yup from "yup";
import apiUser from "../../api/apiUser";
import appStrings from "../../constants/app.strings";
import { ILoginDto } from "../../Interfaces/Entities/ILoginDto";
import { IMessage, MessageStatus } from "../../Interfaces/IMessage";
import { revokeToken } from "../../tokenHelper/tokenHelper";

export interface ILoginProps {
  setLoginMessage(message: IMessage): void;
}

const loginSchema = yup.object().shape({
  username: yup.string().required(appStrings.loginForm.usernameRequired),
  password: yup.string().required(appStrings.loginForm.passwordRequired),
});

const showErrorBox = (
  errors: FormikErrors<ILoginDto>,
  touched: FormikTouched<ILoginDto>
): boolean => {
  if (
    (errors.username && touched.username) ||
    (errors.password && touched.password)
  ) {
    return true;
  }

  return false;
};

function LoginForm(props: ILoginProps): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function submitLogin(loginFormInput: ILoginDto) {
    try {
      await apiUser.login(loginFormInput);
      props.setLoginMessage({ status: MessageStatus.success, message: "" });
    } catch {
      revokeToken();
    }
  }

  const initialValues: ILoginDto = {
    username: "",
    password: "",
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h1>{appStrings.loginForm.title}</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => submitLogin(values)}
          validationSchema={loginSchema}
        >
          {({ isValid, dirty, errors, touched }) => (
            <Form>
              {showErrorBox(errors, touched) && (
                <div className="errorBox">
                  <h4>{appStrings.errorBoxTitle}</h4>
                  <ul>
                    <ErrorMessage name="username" component="li" />
                    <ErrorMessage name="password" component="li" />
                  </ul>
                </div>
              )}
              <div>
                <label htmlFor="username">
                  {appStrings.loginForm.usernameLabel}
                </label>
                <Field type="text" name="username" id="username" />
              </div>
              <div>
                <label htmlFor="password">
                  {appStrings.loginForm.passwordLabel}
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                />
              </div>
              <div className="checkboxGroup">
                <input
                  type="checkbox"
                  id="showPassword"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword">
                  {appStrings.loginForm.showPassword}
                </label>
              </div>
              <div className="buttonContainer">
                <button
                  className="appButton"
                  type="submit"
                  disabled={!dirty || !isValid}
                >
                  {appStrings.submit}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginForm;
