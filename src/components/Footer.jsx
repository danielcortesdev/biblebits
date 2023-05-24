import React from "react";
import "../styles/footer.scss";
import languageIcon from "/language.svg";
function Footer(props) {
  return (
    <footer>
      <p>© {props.text}</p>
    </footer>
  );
}

export default Footer;
