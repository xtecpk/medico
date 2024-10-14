import React from "react";
import "./uploadModal.css";
import { Dropzone } from "../../components";

const UploadModal = () => {
  return (
    <>
      <div className="expert_upload_modal_div">
        <Dropzone content={"Click to Upload Document"} />
      </div>
    </>
  );
};

export default UploadModal;
