import React from "react";
import "../styles/dropdown.scss";
import { BibleContext } from "../context";

function Dropdown({ id, disabled, text, icon, options, handleToggle, isOpen }) {
  const { setBible } = React.useContext(BibleContext);
  const dropdownRef = React.useRef();

  // Reset Home fetching dependencies
  React.useEffect(() => {
    setBible((prevBible) => ({
      ...prevBible,
      bookId: "",
      chapterId: "",
      verseId: "",
      verse: "",
    }));
  }, []);

  function handleOption(event) {
    if (id == "Biblia") {
      setBible((prevBible) => ({
        ...prevBible,
        bibleId: event.target.getAttribute("data-value"),
        bibleName: event.target.textContent,
      }));
    } else if (id == "Lenguaje") {
      setBible((prevBible) => ({
        ...prevBible,
        languageId: event.target.getAttribute("data-value"),
        languageName: event.target.textContent,
        bibleId: "",
        bibleName: "",
      }));
    }
  }

  return (
    <div
      id={id}
      className={`dropdown ${!text && "required"}`}
      ref={dropdownRef}
      onClick={() => handleToggle(id)}
    >
      <label className="dropdown-label" htmlFor={id}>
        {id}
      </label>
      <button className="dropdown-toggle" disabled={disabled}>
        <div className={`dropdown-icon ${icon}-icon`}></div>
        <p>{text}</p>
        <div className={`dropdown-arrow ${isOpen && "active-arrow"}`}></div>
      </button>
      <ul className={`dropdown-menu ${!isOpen && "hidden"}`}>
        {options.map((option, index) => (
          <li
            key={index}
            data-value={option.value}
            className="dropdown-item"
            onClick={handleOption}
          >
            {option.data}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
