import React from "react";
import "../styles/button.scss";

function Button(props) {
  return (
    <button
      className={props.className ? `button ${props.className}` : "button"}
      onClick={props.onClick}
    >
      {props.icon ? (
        <>
          <div className={props.icon}></div>
          {props.text}
        </>
      ) : (
        props.text
      )}
    </button>
  );
}

export default Button;
