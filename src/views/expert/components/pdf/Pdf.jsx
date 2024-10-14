import React from "react";
import "./pdf.css";
import { pdfIcon } from "../../assets";
import { Link } from "react-router-dom";

const Pdf = ({ name, size, to = "/" }) => {
  return (
    <>
      <div className={`pdf_div`}>
        <div>
          <img src={pdfIcon} alt="pdf icon" />
        </div>
        <div className="d-flex flex-column ">
          <p className="pdf_name">
            {name}
          </p>
          <span>{size}</span>
        </div>
      </div>
    </>
  );
};

export default Pdf;
