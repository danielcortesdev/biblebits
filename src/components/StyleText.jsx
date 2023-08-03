import React from "react";
import "../styles/style-text-menu.scss";
import "../styles/style-text-submenu.scss";

function StyleText(props) {
  const [indicesArr, setIndicesArr] = React.useState([]);
  const [mouseCoordinates, setMouseCoordinates] = React.useState({
    clientX: 0,
    clientY: 0,
  });
  const [selectedText, setSelectedText] = React.useState({
    startIndex: 0,
    endIndex: 0,
  });

  /* MENU STATES AND VARIABLES */
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const [textStyle, setTextStyle] = React.useState({
    color: "",
    fontStyle: "",
  });
  const [menuStyle, setMenuStyle] = React.useState({
    visibility: "hidden",
  });
  const [menuOptionIsActive, setMenuOptionIsActive] = React.useState({
    highlight: false,
    fontstyle: false,
  });
  const display = {
    highlight: {
      display: menuOptionIsActive.highlight ? "grid" : "none",
    },
    fontstyle: {
      display: menuOptionIsActive.fontstyle ? "grid" : "none",
    },
  };
  const [submenuDirection, setSubmenuDirection] = React.useState({
    row1: "",
    row2: "",
  });

  /* GENERAL FUNCTIONS */
  // UseEffect to add event listener to the text to be highlighted
  React.useEffect(() => {
    const textElement = document.getElementById(props.textRef.current.id);

    window.addEventListener("mousedown", windowCloseMenu);
    textElement.addEventListener("mouseup", handleTextSelection);

    //TODO: Touch suppport
    textElement.addEventListener("touchend", handleTextSelection);
    //textElement.addEventListener("touchstart", testing);
    textElement.addEventListener("contextmenu", (event) =>
      event.preventDefault(),
    );
    return () => {
      window.removeEventListener("mousedown", windowCloseMenu);
      textElement.removeEventListener("mouseup", handleTextSelection);

      // TOUCH EVENT
      textElement.removeEventListener("touchend", handleTextSelection);
      //textElement.removeEventListener("touchstart", testing);
      textElement.removeEventListener("contextmenu", (event) =>
        event.preventDefault(),
      );
    };
  }, []);

  // Close menu if clicked outside of the target
  function windowCloseMenu(event) {
    const target = event.target;
    const menu = document.getElementById("menu");
    if (!menu.contains(target)) {
      setMenuIsOpen(false);
    }
  }

  // Handle text selection
  function handleTextSelection(event) {
    if (window.getSelection().toString().length > 0) {
      const { startIndex, endIndex } = getSelectionIndices();

      setSelectedText({
        startIndex,
        endIndex,
      });

      // Prevent selection visual clearing if user clicks it
      event.preventDefault();

      setMenuIsOpen(true);

      setMouseCoordinates(() => {
        if (event.type === "mouseup") {
          return {
            clientX: event.clientX,
            clientY: event.clientY,
          };
        } else if (event.type === "touchend") {
          return {
            clientX: 20,
            clientY: props.textRef.current.getBoundingClientRect().top,
          };
        }
      });
    } else {
      setMenuIsOpen(false);
    }
  }

  function getSelectionIndices() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Set the start and end selection indeces
    const startRange = document.createRange();
    startRange.setStart(props.textRef.current, 0);
    startRange.setEnd(range.startContainer, range.startOffset);

    const endRange = document.createRange();
    endRange.setStart(props.textRef.current, 0);
    endRange.setEnd(range.endContainer, range.endOffset);

    const startIndex = startRange.toString().length;
    const endIndex = endRange.toString().length;

    // Sort indices to support reverse selection
    let indices = [startIndex, endIndex];
    indices.sort((a, b) => a - b);

    return {
      startIndex: indices[0],
      endIndex: indices[1],
    };
  }

  /* MENU FUNCTIONS */
  // UseEffect to set up and open the menu
  React.useEffect(() => {
    if (menuIsOpen === true) {
      const root = document.getElementById("root").getBoundingClientRect();

      const screenWidth = window.innerWidth;
      const menuWidth = 232;

      // Menu position coordinates
      let markerX = (mouseCoordinates.clientX / root.width) * 100;
      let markerY = (mouseCoordinates.clientY / root.height) * 100;

      // Determine sub menu opening direction
      if (
        mouseCoordinates.clientX + menuWidth > screenWidth &&
        mouseCoordinates.clientX - menuWidth <= 0
      ) {
        // Right and left overflow
        setSubmenuDirection({
          row1: "menu-row-1-center",
          row2: "menu-row-2-center",
        });
      } else if (mouseCoordinates.clientX + menuWidth > screenWidth) {
        // Right overflow
        setSubmenuDirection({
          row1: "menu-row-1-center",
          row2: "menu-row-2-center",
        });
        markerX = ((mouseCoordinates.clientX - 30) / root.width) * 100;
      } else {
        // No overflow
        setSubmenuDirection({
          row1: "menu-row-1-right",
          row2: "menu-row-2-right",
        });
      }

      // Set menu coordinates and visibility
      setMenuStyle({
        top: markerY + "%",
        left: markerX + "%",
        visibility: "visible",
      });
    } else {
      setMenuStyle({
        visibility: "hidden",
      });
      setMenuOptionIsActive({
        highlight: false,
        fontstyle: false,
      });
    }
  }, [menuIsOpen]);

  function handleMenu(event) {
    const id = event.target.id;

    // Re-select text because the visual selection is lost after clicking a menu opt
    manualTextSelection(
      props.textRef.current,
      selectedText.startIndex,
      selectedText.endIndex,
    );

    // Submenu open/close
    if (id === "highlight") {
      menuOptionIsActive.highlight
        ? setMenuOptionIsActive({
            fontstyle: false,
            highlight: false,
          })
        : setMenuOptionIsActive({
            fontstyle: false,
            highlight: true,
          });
    }
    if (id === "fontStyle") {
      menuOptionIsActive.fontstyle
        ? setMenuOptionIsActive({
            highlight: false,
            fontstyle: false,
          })
        : setMenuOptionIsActive({
            highlight: false,
            fontstyle: true,
          });
    }

    if (id === "erase") {
      handleTextStyling("", "");
    }
    if (id === "clear") {
      window.getSelection().removeAllRanges();
      setMenuIsOpen(false);
    }

    if (id === "copyToClipboard") {
      const selection = window.getSelection();
      navigator.clipboard.writeText(selection.toString());
      setMenuIsOpen(false);
      selection.removeAllRanges();
    }
  }

  function manualTextSelection(target, startIndex, endIndex) {
    const selection = document.getSelection();
    const range = document.createRange();

    range.setStart(target, startIndex);
    range.setEnd(target, endIndex);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handleTextStyling(color, fontStyle) {
    setTextStyle({
      color,
      fontStyle,
    });

    setIndicesArr((prev) => {
      // Create an object with the indices
      let indicesObj = {
        startIndex: selectedText.startIndex,
        endIndex: selectedText.endIndex,
      };

      // Check for indices duplicates and replace it with the new one
      let duplicatedIndex;
      const isDuplicated = prev.some((obj, index) => {
        duplicatedIndex = index;
        return (
          obj.startIndex == selectedText.startIndex &&
          obj.endIndex == selectedText.endIndex
        );
      });

      // Save the indices to state
      return isDuplicated
        ? [
            ...prev.slice(0, duplicatedIndex),
            indicesObj,
            ...prev.slice(duplicatedIndex + 1),
          ]
        : [...prev, indicesObj];
    });

    // Close menu
    setMenuIsOpen(false);
  }

  // Use Effect to style the text
  React.useEffect(() => {
    if (indicesArr.length > 0) {
      const text = props.textRef.current.innerText;
      const characters = text.split("");
      indicesArr.sort((a, b) => b.startIndex - a.startIndex);

      // Highlight text character by character
      const highlightedText = characters.map((char, charIndex) => {
        const isHighlighted = indicesArr.some(
          ({ startIndex, endIndex }) =>
            charIndex >= startIndex && charIndex < endIndex,
        );
        return isHighlighted ? (
          <span
            key={charIndex}
            id={charIndex}
            className={
              charIndex >= selectedText.startIndex &&
              charIndex < selectedText.endIndex
                ? `color-option-${textStyle.color} font-style-${textStyle.fontStyle}`
                : props.text[charIndex].props.className
            }
          >
            {char}
          </span>
        ) : (
          <span id={charIndex} key={charIndex}>
            {char}
          </span>
        );
      });
      // Save the highlighted text to state
      props.setText((prevText) => {
        return {
          ...prevText,
          verse: highlightedText,
        };
      });
      window.getSelection().removeAllRanges();
    }
  }, [indicesArr]);

  return (
    <>
      <div id="menu" className="menu" style={menuStyle}>
        <div id="highlight" className="option-highlight" onClick={handleMenu}>
          <div className={submenuDirection.row1} style={display.highlight}>
            <div
              className="highlight-option-1"
              onClick={() => handleTextStyling(1, "")}
            ></div>
            <div
              className="highlight-option-2"
              onClick={() => handleTextStyling(2, "")}
            ></div>
            <div
              className="highlight-option-3"
              onClick={() => handleTextStyling(3, "")}
            ></div>
            <div
              className="highlight-option-4"
              onClick={() => handleTextStyling(4, "")}
            ></div>
            <div
              className="highlight-option-5"
              onClick={() => handleTextStyling(5, "")}
            ></div>
          </div>
        </div>
        <div id="fontStyle" className="option-font-style" onClick={handleMenu}>
          <div className={submenuDirection.row2} style={display.fontstyle}>
            <div
              className="font-option-1"
              onClick={() => handleTextStyling("", "bold")}
            ></div>
            <div
              className="font-option-2"
              onClick={() => handleTextStyling("", "italic")}
            ></div>
            <div
              className="font-option-3"
              onClick={() => handleTextStyling("", "underline")}
            ></div>
          </div>
        </div>
        <div id="erase" className="option-erase" onClick={handleMenu}></div>
        <div
          id="copyToClipboard"
          className="option-copy"
          onClick={handleMenu}
        ></div>
        <div id="clear" className="option-clear" onClick={handleMenu}></div>
      </div>
    </>
  );
}

export default StyleText;

// Touch Flow:
// 1. El usuario selecciona texto
//    1.1 Mostar menu.
//        - Si el usuario selecciona mas texto, ocultar menu.
//        - Cuando el usuario deje de seleccionar texto, mostart menu otra vez.

// TODO:
// 3. Touch screen support on Firefox and Safari
// 5. If a highlight covers other highlights, remove the covered highlights
