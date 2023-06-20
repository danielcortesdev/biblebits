import React from "react";
import "../styles/share-modal.scss";
import html2canvas from "html2canvas";
import {
  TwitterShareButton,
  EmailShareButton,
  WhatsappShareButton,
} from "react-share";
import twitterIcon from "/twitter.svg";
import emailIcon from "/email.svg";
import whatsappIcon from "/whatsapp.svg";
import imageIcon from "/image-solid.svg";
import linkIcon from "/link-solid.svg";

const url = window.location.href;

function ShareModal(props) {
  const [wasCopied, setWasCopied] = React.useState(false);
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
    const options = {
      backgroundColor: "#F5F5F5",
      onclone: (clone) => {
        const canvasClone = clone.getElementById("canvas");
        canvasClone.style.padding = "24px";
      },
    };
    html2canvas(document.getElementById("canvas"), options).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png"); // File type
      link.download = props.reference; // File name
      link.click();
    });
  }

  return (
    <>
      <div
        id="overlay"
        className={props.modalIsOpen ? "overlay" : "overlay close-overlay"}
        onClick={props.handleModal}
      ></div>
      <div
        className={props.modalIsOpen ? "share-modal open-modal" : "share-modal"}
      >
        <p className={wasCopied ? "url copied" : "url"}>{url}</p>
        <div id="options-box">
          <div className="share-option" onClick={copyToClipboard}>
            <img src={linkIcon} alt="Copy icon" />
          </div>
          <div className="share-option" onClick={downloadScreenshot}>
            <img src={imageIcon} alt="Copy icon" />
          </div>
          <div className="share-option">
            <EmailShareButton
              url={`\n\n Bible bits: ${url}`}
              subject="I want to share this Bible verse with you"
              body={`"${props.verseText}" - ${props.reference}`}
            >
              <img src={emailIcon} alt="Email icon" />
            </EmailShareButton>
          </div>
          <div className="share-option">
            <TwitterShareButton
              url={`\n\n Bible bits: ${url}`}
              title={`"${props.verseText}" - ${props.reference}`}
              hashtags={["Bible", "God"]}
              className="twitter-share-button"
            >
              <img id="share-icon" src={twitterIcon} alt="Twitter icon" />
            </TwitterShareButton>
          </div>
          <div className="share-option">
            <WhatsappShareButton
              url={`\n\n Bible bits: ${url}`}
              title={`"${props.verseText}" - ${props.reference}`}
              className="whatsapp-share-button"
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
