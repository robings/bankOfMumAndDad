import { render, screen } from "@testing-library/react";
import Nav from "./Nav";
import { MemoryRouter } from "react-router";
import appStrings from "../../constants/app.strings";

describe("nav", () => {
  test("displays logout button if logged in", () => {
    render(
      <MemoryRouter>
        <Nav isTransactionsPage={false} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: appStrings.navButtons.logout })
    ).toBeInTheDocument();
  });

  test("displays accounts button if is rendering transaction page", () => {
    render(
      <MemoryRouter>
        <Nav isTransactionsPage={true} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: appStrings.navButtons.accounts })
    ).toBeInTheDocument();
  });
});
