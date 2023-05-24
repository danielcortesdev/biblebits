import React from "react";
import shareIcon from "/share.svg";
import ShareModal from "./components/ShareModal";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const bibleVersions = {
    RV1909: "592420522e16049f-01",
    KJV: "de4e12af7f28f599-01",
  };

  // TODO:
  // 1. TEST
  // 2. Hide env variables
  // 3. Language clarification
  // 4. Share links

  const [bible, setBible] = React.useState({
    id: bibleVersions.KJV,
    bookId: "",
    chapterId: "",
    verseId: "",
    verse: "",
    reference: "",
    copyright: "",
  });
  const [books, setBooks] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [isFetchingBooks, setIsFetchingBooks] = React.useState(false);

  const fetchOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

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
    } else setIsOnline(false);
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
            verse: cleanVerse,
            reference: verse.reference,
            copyright: verse.copyright,
          };
        });
        setIsFetchingBooks(false);
      }
      fetchVerse();
    }
  }, [bible.verseId]);

  function changeVerse() {
    setRandomContent(books, "bookId");

    // Fade animation, CSS 0.5s, Timeout 1s
    const quoteBox = document.getElementById("quote-box");
    quoteBox.classList.add("fade");
    setTimeout(() => {
      quoteBox.classList.remove("fade");
      clearInterval();
    }, 1500);
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

  function handleModal() {
    modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
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
    <>
      <Header changeBibleVersion={changeBibleVersion} />
      {!isFetchingBooks ? (
        <div id="quote-box">
          <div id="canvas">
            <p id="text">
              {bible.verse ? <span>"</span> : null}
              {bible.verse ? bible.verse : null}
            </p>

            <p id="author">{bible.reference}</p>
          </div>
          {bible.verse ? (
            <div id="button-box">
              <button id="share-quote" onClick={handleModal}>
                <img src={shareIcon} alt="twitter logo" />
              </button>
              <button id="new-quote" onClick={changeVerse}>
                {bible.id === bibleVersions.KJV
                  ? "New verse"
                  : "Nuevo versículo"}
              </button>
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
        verse={bible.verse}
        reference={bible.reference}
        handleModal={handleModal}
        modalIsOpen={modalIsOpen}
      />
      {!isFetchingBooks ? <Footer text={bible.copyright} /> : null}
    </>
  );
}
export default App;
