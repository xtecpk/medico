import React from "react";
import "./pdf.css";
import { binIcon, pdfIcon, download } from "../../assets";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Pdf = ({ name, size, editStatus, onDeleteClick, downloadStatus = true, type }) => {
  const role = useLocation().pathname.split("/")[1];
  const lang = useSelector((state) => state.language.value);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const location = useLocation().pathname.split("/")[2];

  const folder = location.split("-")[0] === "cases" ? "cases" : "chat";

  // const handleDownload = () => {
  //   const documentUrl = `${baseURL}/${type}/${name}`;
  //   const link = document.createElement('a');
  //   link.href = documentUrl;
  //   link.download = name;
  //   document.body.appendChild(link);

  //   // Trigger a click on the link
  //   link.click();

  //   // Remove the link from the body
  //   document.body.removeChild(link);
  // };
  console.log(folder + "/" + name);

  return (
    <>
      <div className={`pdf_div ${lang === "ar" ? "pdf_div_ar" : ""}`}>
        <div>
          <img src={pdfIcon} alt="pdf icon" />
        </div>
        <div className="d-flex flex-column ">
          {/* <p className="pdf_name">{name.split(" ").slice(1)}</p> */}
          <p className="pdf_name">{name}</p>
          <span>{size}</span>
        </div>
        {downloadStatus && <a
          href={`${baseURL}/${type || folder}/${name}`}
          download={name}
          target="_blank"
          rel="noreferrer"
        >
          <img src={download} alt="bin" />
        </a>
        }
        {/* <button onClick={handleDownload} className="ml-3">

          </button> */}
        {role === "admin" && (
          <button onClick={onDeleteClick}>
            <img src={binIcon} alt="bin" />
          </button>
        )}
      </div>
    </>
  );
};

export default Pdf;