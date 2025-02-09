// test/Login.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import Login from "../src/components/Login";
import { BrowserRouter } from "react-router-dom";

describe("Login Component", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(screen.getByLabelText(/username/i)).to.exist;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(screen.getByLabelText(/password/i)).to.exist;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(screen.getByRole("button", { name: /login/i })).to.exist;
  });

  it("submits login form with correct data", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if button gets disabled after submission (example assumption)
    expect(screen.getByRole("button", { name: /login/i })).to.have.property(
      "disabled",
      true
    );
  });
});
