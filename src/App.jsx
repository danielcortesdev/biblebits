import React from "react";
import ShareModal from "./components/ShareModal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";
import StyleText from "./components/StyleText";

function App() {
  // Bible states
  const bibleVersions = {
    RV1909: "592420522e16049f-01",
    KJV: "de4e12af7f28f599-01",
  };
  const [bible, setBible] = React.useState({
    id: bibleVersions.RV1909,
    bookId: "",
    chapterId: "",
    verseId: "",
    verse: "",
    verseText: "",
    reference: "",
    copyright: "",
  });
  const [books, setBooks] = React.useState([]);
  const [isFetchingBooks, setIsFetchingBooks] = React.useState(false);
  const [isFetchingVerse, setIsFetchingVerse] = React.useState(false);
  const fetchOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };
  const [shareModalIsOpen, setModalIsOpen] = React.useState(false);
  const verseRef = React.useRef(null);

  const urls = {
    bibles: "https://api.scripture.api.bible/v1/bibles",
    books: `https://api.scripture.api.bible/v1/bibles/${bible.id}/books`,
    chapters: `https://api.scripture.api.bible/v1/bibles/${bible.id}/books/${bible.bookId}/chapters`,
    verses: `https://api.scripture.api.bible/v1/bibles/${bible.id}/chapters/${bible.chapterId}/verses`,
    verse: `https://api.scripture.api.bible/v1/bibles/${bible.id}/verses/${bible.verseId}`,
  };

  // Fetch the list of books and set a random book
  React.useEffect(() => {
    if (books.length == 0 || bible.id) {
      setIsFetchingBooks(true);
      async function fetchBooks() {
        const { data: books } = await fetchData(urls.books, fetchOptions);
        setBooks(books);
        setRandomContent(books, "bookId");
      }
      fetchBooks();
    }
  }, [bible.id]);

  // Fetch the list of chapters of a book and set a random chapter
  React.useEffect(() => {
    if (bible.bookId != "") {
      async function fetchChapters() {
        const { data: chapters } = await fetchData(urls.chapters, fetchOptions);
        chapters.splice(0, 1);
        setRandomContent(chapters, "chapterId");
      }
      fetchChapters();
    }
  }, [bible.bookId]);

  // Fetch the list of verses of a chapter and set a random verse
  React.useEffect(() => {
    if (bible.chapterId != "") {
      async function fetchVerses() {
        const { data: verses } = await fetchData(urls.verses, fetchOptions);
        setRandomContent(verses, "verseId");
      }
      fetchVerses();
    }
  }, [bible.chapterId]);

  // Fetch a verse and render content
  React.useEffect(() => {
    if (bible.verseId != "") {
      async function fetchVerse() {
        const { data: verse } = await fetchData(urls.verse, fetchOptions);
        const cleanVerse = verse.content.replace(/\d+|<\/?[^>]+(>|$)|¶/g, "");
        setBible((prevBible) => {
          return {
            ...prevBible,
            verse: cleanVerse.split("").map((char, charIndex) => (
              <span id={charIndex} key={charIndex}>
                {char}
              </span>
            )),
            verseText: cleanVerse,
            reference: verse.reference,
            copyright: verse.copyright,
          };
        });
        setIsFetchingBooks(false);
      }
      fetchVerse();
    }
  }, [bible.verseId]);

  // Set is fetching verse to false when verse is fetched
  React.useEffect(() => {
    if (bible.verse != "") setIsFetchingVerse(false);
  }, [bible.verse]);

  // Fade in and out the quote box controlled by isFetchingVerse
  React.useEffect(() => {
    const quoteBox = document.getElementById("quote-box");
    const shareBtn = document.getElementById("shareBtn");
    const newVerseBtn = document.getElementById("newVerseBtn");
    if (isFetchingVerse === true) {
      quoteBox.classList.add("fade");
      shareBtn.setAttribute("disabled", true);
      newVerseBtn.setAttribute("disabled", true);
    } else if (bible.verse != "") {
      quoteBox.classList.remove("fade");
      shareBtn.removeAttribute("disabled");
      newVerseBtn.removeAttribute("disabled");
    }
  }, [isFetchingVerse]);

  function changeVerse() {
    setRandomContent(books, "bookId");
    setIsFetchingVerse(true);
    window.getSelection().removeAllRanges();
  }

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

  function handleShareModal() {
    shareModalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
  }

  async function fetchData(url, options) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  function setRandomContent(arr, key) {
    const item = arr[getRandomIntInclusive(0, arr.length)];
    if (item === undefined) {
      console.log("Item is undefined, running again");
      setRandomContent(arr, key);
    } else {
      setBible((prevBible) => {
        return {
          ...prevBible,
          [key]: item.id,
        };
      });
    }
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div id="main">
      <Header
        changeBibleVersion={changeBibleVersion}
        bibleVersion={bible.id}
        bibleVersions={bibleVersions}
      />

      {!isFetchingBooks ? (
        <div id="quote-box">
          <div id="canvas">
            <div id="text" ref={verseRef}>
              {bible.verse}
            </div>
            <p id="author">{bible.reference}</p>
          </div>
          {bible.verse ? (
            <div id="button-box">
              <Button
                id="shareBtn"
                onClick={handleShareModal}
                icon={"share-icon"}
              />
              <Button
                id="newVerseBtn"
                text={
                  bible.id === bibleVersions.KJV
                    ? "New verse"
                    : "Nuevo versículo"
                }
                onClick={changeVerse}
              />
            </div>
          ) : null}
        </div>
      ) : bible.id == bibleVersions.KJV ? (
        <>
          <p>Loading...</p>
          <p>Always read the context of the verse</p>
        </>
      ) : (
        <>
          <p>Cargando...</p>
          <p>Siempre lea el contexto del verso</p>
        </>
      )}

      <ShareModal
        verseText={bible.verseText}
        reference={bible.reference}
        handleModal={handleShareModal}
        modalIsOpen={shareModalIsOpen}
      />
      {!isFetchingBooks ? (
        <StyleText textRef={verseRef} text={bible.verse} setText={setBible} />
      ) : null}
      {!isFetchingBooks ? <Footer text={bible.copyright} /> : null}
    </div>
  );
}
export default App;

// TODO:
// 1. Touch support.
// 2. Improve UI.
