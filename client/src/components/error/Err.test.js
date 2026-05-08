import React from "react";
import { render, screen } from "@testing-library/react";
import Err from "./Err";

test("Err renders info text", () => {
  render(<Err info="Boom" />);
  expect(screen.getByText("Boom")).toBeInTheDocument();
});
