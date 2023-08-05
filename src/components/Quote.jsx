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

function Quote({ b, setBible, setShareModalIsOpen }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const quoteDivRef = React.useRef();
  const verseRef = React.useRef(null);

  // Fetch Books and set bookId
  React.useEffect(() => {
    if (b.bibleId)
      getId(() => fetchBooks(b.bibleId)).then(({ id, data }) => {
        setBible((prevBible) => ({ ...prevBible, bookId: id, books: data }));
      });
  }, [b.bibleId]);

  // Fetch chapters and set chapterId
  React.useEffect(() => {
    if (b.bookId) {
      getId(() => fetchChapters(b.bibleId, b.bookId), 1).then(
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
  }, [b.bookId]);

  // Fetch verses and set verseId
  React.useEffect(() => {
    if (b.chapterId)
      getId(() => fetchVerses(b.bibleId, b.chapterId)).then(({ id, data }) => {
        setBible((prevBible) => ({ ...prevBible, verseId: id, verses: data }));
      });
  }, [b.chapterId]);

  // // Fetch verse and set it
  React.useEffect(() => {
    if (b.verseId)
      fetchVerse(b.bibleId, b.verseId).then(({ data }) => {
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
  }, [b.verseId]);

  React.useEffect(() => {
    if (b.verse) setIsLoading(false);
  }, [b.verse]);

  async function getId(callback, startIndex = 0) {
    const data = await callback();
    const id = getRandomItem(data, startIndex);
    return { id, data };
  }

  function changeVerse() {
    setTimeout(() => {
      setBible((prevBible) => ({
        ...prevBible,
        bookId: b.books.map((book) => book.id)[
          getRandomIndex(0, b.books.length - 1)
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
            {b.verse}
          </div>
          <p className="verse-reference">{b.reference}</p>
        </div>

        <div className="buttons-container">
          <Button
            icon={"share-icon"}
            onClick={() => setShareModalIsOpen((prev) => !prev)}
          />
          <Button text="Nuevo versiculo" onClick={changeVerse} />
        </div>
      </div>

      <StyleText textRef={verseRef} text={b.verse} setText={setBible} />
    </>
  );
}

export default Quote;
