// React
import React from "react";

// Components
import ShareModal from "./ShareModal";
import Header from "./Header";
import Footer from "./Footer";
import Quote from "./Quote";

// Context
import { BibleContext } from "../context";

function Home() {
  const [shareModalIsOpen, setShareModalIsOpen] = React.useState(false);
  const { bible, setBible } = React.useContext(BibleContext);

  return (
    <div className="main">
      <Header />
      <Quote
        setShareModalIsOpen={setShareModalIsOpen}
        bible={bible}
        setBible={setBible}
      />
      <ShareModal
        shareModalIsOpen={shareModalIsOpen}
        setShareModalIsOpen={setShareModalIsOpen}
        reference={bible.reference}
        verseText={bible.verseText}
      />
      <Footer copyright={bible.copyright} />
    </div>
  );
}

export default Home;

// TODO:
// 1. Touch support.
// 2. Improve UI.

// Future features:
// 1. Multiple bible versions
// 2. Save bible to local storage
// 3. Save verse to favorites / Local storage
