import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.scss";
import logo from "/logo_1.svg";

function Header() {
  return (
    <header className="home-header">
      <a
        href="https://www.linkedin.com/in/danielcortesdev/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={logo} alt="Bible bits logo" />
      </a>
      {/* The realoadDocument avoids that when returning Home it makes multiple request to the API*/}
      <Link to="/settings" className="settings-link"></Link>
    </header>
  );
}

export default Header;
