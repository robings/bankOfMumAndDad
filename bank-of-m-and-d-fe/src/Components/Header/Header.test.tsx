import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import Header from "./Header";

const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

beforeAll(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("header", () => {
  const renderHeader = (
    displayPageHeader: boolean = true,
    title: string | undefined = undefined
  ) => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header displayPageHeader={displayPageHeader} title={title} />
      </MemoryRouter>
    );
  };
  test("displays title of app", () => {
    renderHeader();

    expect(
      screen.getByRole("heading", { name: appStrings.title })
    ).toBeInTheDocument();
  });

  test("displays logo", () => {
    renderHeader();

    expect(screen.getByAltText(appStrings.logoAltText)).toBeInTheDocument();
  });

  test("displays login time if logged in", () => {
    const loginTime = `${appStrings.loggedInAt} ${10}:${23}`;

    localStorage.setItem(appStrings.localStorageKeys.loginTime, loginTime);

    renderHeader();

    expect(screen.getByText(loginTime)).toBeInTheDocument();
  });

  test("does not display login time if not logged in", () => {
    renderHeader();

    expect(
      screen.queryByText(new RegExp(appStrings.loggedInAt))
    ).not.toBeInTheDocument();
  });

  test("displays page title if one passed in", () => {
    const title = "Page Title";

    renderHeader(true, title);

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  });

  test("displays log out button", () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    renderHeader();

    expect(screen.getByRole("button", { name: appStrings.navButtons.logout }));
  });

  test("removes token and calls useNavigate when log out button is clicked", async () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    renderHeader();

    userEvent.click(
      screen.getByRole("button", { name: appStrings.navButtons.logout })
    );

    await waitFor(() => {
      expect(
        localStorage.getItem(appStrings.localStorageKeys.bearerToken)
      ).toBe(null);
    });

    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/");
  });

  test("does not display log out button, when not logged in", () => {
    renderHeader();

    expect(
      screen.queryByRole("button", { name: appStrings.navButtons.logout })
    ).not.toBeInTheDocument();
  });

  test("displays page header when displayPageHeader is true", () => {
    renderHeader(true);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("does not display page header when displayPageHeader is false", () => {
    renderHeader(false);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  test("displays children passed in", () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    const buttonOneText = "Button One";
    const buttonTwoText = "Button Two";

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header displayPageHeader title="my Title">
          <button onClick={() => {}}>{buttonOneText}</button>
          <button onClick={() => {}}>{buttonTwoText}</button>
        </Header>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: buttonOneText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: buttonTwoText })
    ).toBeInTheDocument();
  });
});
