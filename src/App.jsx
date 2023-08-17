// React
import React from "react";

// Components
import Home from "./components/Home";
import Settings from "./components/Settings";
import { Routes, Route } from "react-router-dom";

// Context
import { BibleContext } from "./context";

function App() {
  const [bible, setBible] = React.useState({
    languageId: "SPA",
    languageName: "SPA - Español",
    bibleId: "592420522e16049f-01",
    bibleName: "Reyna Valera 1909",
    bookId: "",
    books: [],
    chapterId: "",
    chapters: [],
    verseId: "",
    verse: "",
    verseText: "",
    reference: "",
    copyright: "",
  });

  return (
    <BibleContext.Provider value={{ bible, setBible }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BibleContext.Provider>
  );
}
export default App;
