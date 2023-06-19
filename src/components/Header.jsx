import React from "react";
import "../styles/header.scss";
import logo from "/bible_bits_logo.png";
import languageIcon from "/language.svg";

function Header(props) {
  return (
    <header>
      <a href="https://www.linkedin.com/in/danielcortesdev/" target="_blank">
        <img src={logo} alt="Bible bits logo" />
      </a>
      <div>
        <p>
          {
          props.bibleVersion == props.bibleVersions.KJV 
          ? "Español"
          : "English"
      } </p>
        <img
          src={languageIcon}
          alt="language icon"
          onClick={props.changeBibleVersion}
        />
      </div>
    </header>
  );
}

export default Header;
