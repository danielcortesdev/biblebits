// React
import React from "react";

// Components
import ShareModal from "./components/ShareModal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Quote from "./components/Quote";

function App() {
  const [b, setBible] = React.useState({
    bibleId: "592420522e16049f-01",
    bookId: "",
    books: [],
    chapterId: "",
    chapters: [],
    verseId: "",
    verse: "",
    reference: "",
    copyright: "",
  });
  const [shareModalIsOpen, setShareModalIsOpen] = React.useState(false);

  function changeBibleVersion() {
    setBible((prevBible) => {
      return {
        ...prevBible,
        id:
          prevBible.id === bibleVersions.KJV
            ? bibleVersions.RV1909
            : bibleVersions.KJV,
      };
    });
  }

  return (
    <div id="main">
      {/* TODO: bibleversions */}
      <Header
        bibleVersion={b.id}
        bibleVersions={"bibleVersions"}
        changeBibleVersion={changeBibleVersion}
      />
      <Quote
        b={b}
        setBible={setBible}
        setShareModalIsOpen={setShareModalIsOpen}
      />
      <ShareModal
        verseText={b.verse}
        reference={b.reference}
        shareModalIsOpen={shareModalIsOpen}
        setShareModalIsOpen={setShareModalIsOpen}
      />
      <Footer text={b.copyright} />
    </div>
  );
}
export default App;

// TODO:
// 1. Touch support.
// 2. Improve UI.

// Future features:
// 1. Multiple bible versions
// 2. Save bible to local storage
// 3. Save verse to favorites / Local storage
