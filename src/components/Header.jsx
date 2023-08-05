import React from "react";
import "../styles/header.scss";
import logo from "/logo_1.svg";
import settingsIcon from "/settings-solid.svg";

function Header(props) {
  return (
    <header>
      <a href="https://www.linkedin.com/in/danielcortesdev/" target="_blank" rel="noreferrer">
        <img src={logo} alt="Bible bits logo" />
      </a>
      <div>
        <p>settings icon</p>
      </div>
    </header>
  );
}

export default Header;
