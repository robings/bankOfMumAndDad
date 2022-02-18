import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiUser from "../../api/apiUser";
import appStrings from "../../constants/app.strings";
import LoginPage from "./LoginPage";

jest.mock("../../api/apiUser");

describe("login form", () => {
  const renderLoginForm = () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>
    );
  };

  test("displays title", () => {
    renderLoginForm();
    expect(
      screen.getByRole("heading", { name: appStrings.loginForm.title })
    ).toBeInTheDocument();
  });

  test("displays username input", () => {
    renderLoginForm();
    expect(
      screen.getByLabelText(appStrings.loginForm.usernameLabel)
    ).toBeInTheDocument();
  });

  test("displays password input", () => {
    renderLoginForm();
    expect(
      screen.getByLabelText(appStrings.loginForm.passwordLabel)
    ).toBeInTheDocument();
  });

  test("calls login api on clicking submit", async () => {
    const loginMock = apiUser.login as jest.MockedFunction<
      typeof apiUser.login
    >;

    renderLoginForm();

    const username = "Username";
    const password = "Password";

    userEvent.type(
      await screen.findByLabelText(appStrings.loginForm.usernameLabel),
      username
    );
    userEvent.type(
      screen.getByLabelText(appStrings.loginForm.passwordLabel),
      password
    );

    userEvent.click(screen.getByRole("button", { name: appStrings.submit }));

    // avoiding console warning due to Formik changes using waitFor
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ username, password });
    });
  });
});
