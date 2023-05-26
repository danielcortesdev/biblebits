import React from "react";
import "../styles/selectedTextMenu.scss";

const SelectedTextMenu = (props) => {
  const containerRect = document.getElementById("root").getBoundingClientRect();
  const markerX = (props.clientX / containerRect.width) * 100
  const markerY = (props.clientY / containerRect.height) * 100;
  const styles = {
    top: markerY + "%",
    left: markerX + "%",
  };
  const [divElements, setDivElements] = React.useState([]);

  // Run once
  React.useEffect(() => {
    // Get div elements
    setDivElements(getDivElements());
  }, []);

  function getDivElements() {
    const divElements = [];
    for (let i = 0; i < 5; i++) {
      divElements.push(
        <div
          key={i}
          className={`color-option-${i + 1}`}
          onClick={() => props.handleColorChange(`highlight-color-${i + 1}`)}
        ></div>
      );
    }
    return divElements;
  }

  return (
    <div className="selected-text-menu" style={styles}>
      {divElements}
    </div>
  );
};

export default SelectedTextMenu;
