import React from "react";
import "../styles/share-modal.scss";

// Components
import html2canvas from "html2canvas";
import {
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
} from "react-share";

// Icons
import twitterIcon from "/twitter.svg";
import emailIcon from "/email.svg";
import whatsappIcon from "/whatsapp.svg";
import imageIcon from "/image-solid.svg";
import linkIcon from "/link-solid.svg";

function ShareModal({
  shareModalIsOpen,
  setShareModalIsOpen,
  reference,
  verseText,
}) {
  const [wasCopied, setWasCopied] = React.useState(false);
  const whatsAppRef = React.useRef();
  const twitterRef = React.useRef();
  const emailRef = React.useRef();
  const url = window.location.href;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
      setWasCopied(true);
      setTimeout(() => {
        setWasCopied(false);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  }

  function downloadScreenshot() {
    const canvasElement = document.getElementById("canvas");
    const options = {
      backgroundColor: "#F5F5F5",
      onclone: (clone) => {
        const canvasClone = clone.getElementById("canvas");
        canvasClone.style.padding = "24px";
      },
    };
    html2canvas(canvasElement, options).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png"); // File type
      link.download = reference; // File name
      link.click();
    });
  }

  // Workaround for the react-share buttons clickable area
  function handleButtonClick(ref) {
    ref.current.click();
  }

  return (
    <>
      <div
        id="overlay"
        className={shareModalIsOpen ? "overlay" : "overlay close-overlay"}
        onClick={() => setShareModalIsOpen(!shareModalIsOpen)}
      ></div>
      <div
        className={shareModalIsOpen ? "share-modal open-modal" : "share-modal"}
      >
        <p className={wasCopied ? "url copied" : "url"}>{url}</p>
        <div className="options-box">
          <div className="share-option" onClick={copyToClipboard}>
            <img src={linkIcon} alt="Copy icon" />
          </div>
          <div className="share-option" onClick={downloadScreenshot}>
            <img src={imageIcon} alt="Copy icon" />
          </div>
          <div
            className="share-option"
            onClick={() => handleButtonClick(emailRef)}
          >
            <EmailShareButton
              ref={emailRef}
              url={`\n\n Bible bits: ${url}`}
              subject="I want to share this Bible verse with you"
              body={`"${verseText}" - ${reference}`}
              className="share-option-icon"
            >
              <img src={emailIcon} alt="Email icon" />
            </EmailShareButton>
          </div>
          <div
            className="share-option"
            onClick={() => handleButtonClick(twitterRef)}
          >
            <TwitterShareButton
              ref={twitterRef}
              url={`\n\n Bible bits: ${url}`}
              title={`"${verseText}" - ${reference}`}
              hashtags={["Bible", "God", "Jesus"]}
              className="share-option-icon"
            >
              <img src={twitterIcon} alt="Twitter icon" />
            </TwitterShareButton>
          </div>
          <div
            className="share-option"
            onClick={() => handleButtonClick(whatsAppRef)}
          >
            <WhatsappShareButton
              ref={whatsAppRef}
              url={`\n\n Bible bits: ${url}`}
              title={`"${verseText}" - ${reference}`}
              className="share-option-icon"
            >
              <img src={whatsappIcon} alt="Whatsapp icon" />
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareModal;
