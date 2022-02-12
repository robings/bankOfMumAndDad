import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("header", () => {
    test("displays title", () => {
      render(<Header />);

      expect(
        screen.getByRole("heading", { name: "Bank Of Mum And Dad" })
      ).toBeInTheDocument();
    });

    test("displays logo", () => {
      render(<Header />);

      expect(screen.getByAltText("Fraught Mum and Dad")).toBeInTheDocument();
    });
});