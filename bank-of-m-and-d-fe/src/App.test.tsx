import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { toast } from "react-toastify";
import App from "./App";
import appStrings from "./constants/app.strings";

describe("app", () => {
  const renderApp = () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  };

  test("displays header on starting application", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: appStrings.title })
    ).toBeInTheDocument();
  });

  test("displays login on starting application", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  test("shows toast if toast requested", async () => {
    renderApp();

    const theToast = "A toast to you my friend";

    act(() => {
      toast(theToast);
    });

    expect(await screen.findByText(theToast)).toBeInTheDocument();
  });
});