import React from "react";
import "../styles/settings.scss";

// Components
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useQuery } from "@tanstack/react-query";

// Fetch
import fetchBibles from "../fetch/fetchBibles";

// Context
import { BibleContext } from "../context";

function Settings() {
  const { bible } = React.useContext(BibleContext);
  const [dropdownId, setDropdownId] = React.useState(null);
  const queryBibles = useQuery({
    queryKey: ["bibles"],
    queryFn: fetchBibles,
    staleTime: Infinity,
  });

  function getLangOpt(bibles) {
    return bibles
      .map((bible) => {
        const { id, nameLocal } = bible.language;
        return `${id.toUpperCase()} - ${nameLocal}`;
      })
      .filter((lang, index, array) => array.indexOf(lang) === index)
      .map((lang) => {
        return { id: lang.slice(0, 3), value: lang.slice(0, 3), data: lang };
      });
  }

  function getBibleOpt(bibles) {
    const result = bibles
      .filter(({ language }) => language.id === bible.languageId.toLowerCase())
      .map(({ id, name, description }) => ({
        id: id,
        value: id,
        data: description ? `${name} (${description})` : name,
      }));
    return result;
  }

  function handleToggle(newId) {
    setDropdownId((prevId) => (prevId === newId ? null : newId));
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <Link to={bible.bibleId ? "/" : ""} className="back-button"></Link>
        <h1>{bible.languageId === "SPA" ? "Preferencias" : "Preferences"}</h1>
      </header>
      <section className="settings-options">
        <Dropdown
          id="Lenguaje"
          text={bible.languageName}
          options={queryBibles.isSuccess ? getLangOpt(queryBibles.data) : []}
          icon="language"
          disabled={queryBibles.isLoading}
          handleToggle={handleToggle}
          isOpen={dropdownId == "Lenguaje"}
        />
        <Dropdown
          id="Biblia"
          text={bible.bibleName}
          options={queryBibles.isSuccess ? getBibleOpt(queryBibles.data) : []}
          icon="bible"
          disabled={queryBibles.isLoading}
          handleToggle={handleToggle}
          isOpen={dropdownId == "Biblia"}
        />
      </section>
    </div>
  );
}

export default Settings;
