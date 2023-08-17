import React from "react";
import "../styles/quote.scss";
import "../styles/fade.scss";

// Components
import Button from "./Button";
import Loading from "./Loading";
import StyleText from "./StyleText";

// Fetch
import fetchBooks from "../fetch/fetchBooks";
import fetchChapters from "../fetch/fetchChapters";
import fetchVerses from "../fetch/fetchVerses";
import fetchVerse from "../fetch/fetchVerse";
import getRandomItem from "../fetch/getRandomItem";

function Quote({ setShareModalIsOpen, bible, setBible }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const quoteDivRef = React.useRef(null);
  const verseRef = React.useRef(null);

  // Fetch Books and set bookId
  React.useEffect(() => {
    if (bible.bibleId) {
      getId(() => fetchBooks(bible.bibleId)).then(({ id, data }) => {
        setBible((prevBible) => ({ ...prevBible, bookId: id, books: data }));
      });
    }
  }, [bible.bibleId]);

  // Fetch chapters and set chapterId
  React.useEffect(() => {
    if (bible.bookId) {
      getId(() => fetchChapters(bible.bibleId, bible.bookId), 1).then(
        ({ id, data }) => {
          setBible((prevBible) => ({
            ...prevBible,
            chapterId: id,
            chapters: data,
          }));
        },
      );
      setIsLoading(true);
    }
  }, [bible.bookId]);

  // Fetch verses and set verseId
  React.useEffect(() => {
    if (bible.chapterId)
      getId(() => fetchVerses(bible.bibleId, bible.chapterId)).then(
        ({ id, data }) => {
          setBible((prevBible) => ({
            ...prevBible,
            verseId: id,
            verses: data,
          }));
        },
      );
  }, [bible.chapterId]);

  // // Fetch verse and set it
  React.useEffect(() => {
    if (bible.verseId)
      fetchVerse(bible.bibleId, bible.verseId).then(({ data }) => {
        const { content, reference, copyright } = data;
        const cleanContent = content.trim();
        const formatedContent = cleanContent
          .split("")
          .map((char, index) => <span key={index}>{char}</span>);

        setBible((prevBible) => ({
          ...prevBible,
          verse: formatedContent,
          verseText: cleanContent,
          reference,
          copyright,
        }));
      });
  }, [bible.verseId]);

  React.useEffect(() => {
    if (bible.verse) setIsLoading(false);
  }, [bible.verse]);

  async function getId(callback, startIndex = 0) {
    const data = await callback();
    const id = getRandomItem(data, startIndex);
    return { id, data };
  }

  function changeVerse() {
    // BUG: sometimes the timeout fails, so it doesn't change the bookId
    setTimeout(() => {
      setBible((prevBible) => ({
        ...prevBible,
        bookId: bible.books.map((book) => book.id)[
          getRandomIndex(0, bible.books.length - 1)
        ],
      }));
    }, 500);
    quoteDivRef.current.classList.replace("fade-in", "fade-out");
  }

  function getRandomIndex(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div ref={quoteDivRef} className="quote-container fade-in">
        <div id="canvas">
          <div className="verse-text" ref={verseRef} id="verseText">
            {bible.verse}
          </div>
          <p className="verse-reference">{bible.reference}</p>
        </div>

        <div className="buttons-container">
          <Button
            icon={"share-icon"}
            onClick={() => setShareModalIsOpen((prev) => !prev)}
          />
          <Button
            text={bible.languageId === "SPA" ? "Nuevo Versículo" : "New Verse"}
            onClick={changeVerse}
          />
        </div>
      </div>

      <StyleText textRef={verseRef} text={bible.verse} setText={setBible} />
    </>
  );
}

export default Quote;
