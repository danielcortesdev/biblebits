import React from "react";
import "../styles/loading.scss";
import "../styles/fade.scss";

function Loading() {
  return (
    <div className="loading-container fade-in">
      <div className="loading-ring-one"></div>
      <div className="loading-ring-two"></div>
    </div>
  );
}

export default Loading;
