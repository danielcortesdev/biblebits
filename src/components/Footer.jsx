import React from "react";
import "../styles/footer.scss";

function Footer({ copyright }) {
  return <footer>{copyright ? <p>© {copyright}</p> : null}</footer>;
}

export default Footer;
