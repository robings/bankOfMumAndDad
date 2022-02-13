import { render, screen } from "@testing-library/react";
import appStrings from "../../constants/app.strings";
import Header from "./Header";

describe("header", () => {
  test("displays title", () => {
    render(<Header />);

    expect(
      screen.getByRole("heading", { name: appStrings.title })
    ).toBeInTheDocument();
  });

  test("displays logo", () => {
    render(<Header />);

    expect(screen.getByAltText(appStrings.logoAltText)).toBeInTheDocument();
  });
});