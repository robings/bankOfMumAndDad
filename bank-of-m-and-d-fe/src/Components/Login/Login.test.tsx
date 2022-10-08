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

  test("displays checkbox for showing password", () => {
    renderLoginForm();

    expect(
      screen.getByLabelText(appStrings.loginForm.showPassword)
    ).toBeInTheDocument();
  });

  test("displays password input as password type by default", () => {
    renderLoginForm();

    expect(
      screen.getByLabelText(appStrings.loginForm.passwordLabel)
    ).toHaveAttribute("type", "password");
  });

  test("displays password input as text type when show password is checked", async () => {
    renderLoginForm();

    await userEvent.click(
      screen.getByLabelText(appStrings.loginForm.showPassword)
    );

    expect(
      screen.getByLabelText(appStrings.loginForm.passwordLabel)
    ).toHaveAttribute("type", "text");
  });

  test("displays submit button, which is disabled", () => {
    renderLoginForm();

    expect(
      screen.getByRole("button", { name: appStrings.submit })
    ).toBeDisabled();
  });

  test("enables submit button with valid input", async () => {
    renderLoginForm();

    const username = "Username";
    const password = "Password";

    await userEvent.type(
      await screen.findByLabelText(appStrings.loginForm.usernameLabel),
      username
    );
    await userEvent.type(
      screen.getByLabelText(appStrings.loginForm.passwordLabel),
      password
    );

    expect(
      await screen.findByRole("button", { name: appStrings.submit })
    ).toBeEnabled();
  });

  test("calls login api on clicking submit", async () => {
    const loginMock = apiUser.login as jest.MockedFunction<
      typeof apiUser.login
    >;

    renderLoginForm();

    const username = "Username";
    const password = "Password";

    await userEvent.type(
      await screen.findByLabelText(appStrings.loginForm.usernameLabel),
      username
    );
    await userEvent.type(
      screen.getByLabelText(appStrings.loginForm.passwordLabel),
      password
    );

    expect(
      await screen.findByRole("button", { name: appStrings.submit })
    ).toBeEnabled();

    await userEvent.click(
      screen.getByRole("button", { name: appStrings.submit })
    );

    // avoiding console warning due to Formik changes using waitFor
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ username, password });
    });
  });

  test("disables form on clicking submit", async () => {
    renderLoginForm();

    const username = "Username";
    const password = "Password";

    await userEvent.type(
      await screen.findByLabelText(appStrings.loginForm.usernameLabel),
      username
    );
    await userEvent.type(
      screen.getByLabelText(appStrings.loginForm.passwordLabel),
      password
    );

    const submitButton = await screen.findByRole("button", {
      name: appStrings.submit,
    });

    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    // avoiding console warning due to Formik changes using waitFor
    await waitFor(() => {
      expect(screen.getByRole("group")).toBeDisabled();
    });
  });


  test("shows error if no username is entered", async () => {
    renderLoginForm();

    await userEvent.click(
      screen.getByLabelText(appStrings.loginForm.usernameLabel)
    );
    await userEvent.tab();

    expect(await screen.findByRole("listitem")).toHaveTextContent(
      appStrings.loginForm.usernameRequired
    );
  });

  test("shows error if no password is entered", async () => {
    renderLoginForm();

    await userEvent.click(
      screen.getByLabelText(appStrings.loginForm.passwordLabel)
    );
    await userEvent.tab();

    expect(await screen.findByRole("listitem")).toHaveTextContent(
      appStrings.loginForm.passwordRequired
    );
  });
});
