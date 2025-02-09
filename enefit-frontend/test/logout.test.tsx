// test/Logout.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import Logout from "../src/components/Logout";

describe("Logout Component", () => {
  beforeEach(() => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", "testuser");
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders logout button", () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(screen.getByRole("button", { name: /logout/i })).to.exist;
  });

  it("clears session storage and navigates on logout", () => {
    const navigateSpy = sinon.spy(); // Spy to check if navigate is called

    // Mock useNavigate to return our spy
    sinon.replace(React, "useNavigate", () => navigateSpy);

    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    // Simulate clicking the logout button
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    // Assert sessionStorage is cleared
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(sessionStorage.getItem("isLoggedIn")).to.be.null;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(sessionStorage.getItem("username")).to.be.null;

    // Assert navigation to '/' occurred
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(navigateSpy.calledOnceWith("/")).to.be.true;

    sinon.restore(); // Restore original useNavigate
  });
});
