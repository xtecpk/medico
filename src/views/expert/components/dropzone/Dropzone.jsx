import React from "react";
import "./dropzone.css";

const Dropzone = ({ content, className = "", uploadFile = () => { } }) => {
  return (
    <>
      <label htmlFor="dropzone-file" className={`dropzone_label ${className}`}>
        {content}
        <input id="dropzone-file" onChange={uploadFile} type="file" />
      </label>
    </>
  );
};

export default Dropzone;
