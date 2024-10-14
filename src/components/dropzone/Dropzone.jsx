import React from "react";
import "./dropzone.css";

const Dropzone = ({ content, className = "", setFiles, files }) => {

  const uploadFile = (event) => {
    setFiles([
      event.target.files[0]
    ])
  }

  return (
    <>
      <label htmlFor="dropzone-file" className={`dropzone_label ${className}`}>
        {content}
        <input id="dropzone-file" type="file" onChange={uploadFile} />
      </label>
    </>
  );
};

export default Dropzone;
