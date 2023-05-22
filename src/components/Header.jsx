import React from "react";
import "../styles/header.scss";
import logo from "/bible_bits_logo.png";

function Header(props) {
  return (
    <header>
      <a href="https://www.linkedin.com/in/danielcortesdev/" target="_blank">
        <img src={logo} alt="Bible bits logo" />
      </a>
    </header>
  );
}

export default Header;
