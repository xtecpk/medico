import axios from 'axios'
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import FileFinder from '../../../../components/custom/FileFinder';
import { t } from 'i18next';

const DocumentUpload = ({ toggleUploadModal, className, id, content, profileDocs, docName, getDocuments, clientId }) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const ClientId = clientId || Cookies.get('clientId');
    const token = Cookies.get('token')

    const [isErrorVisible, setIsErrorVisible] = useState(false)
    const [file, setFile] = useState(null);

    const addProfileDocument = async () => {
        await axios.post(baseURL + "/api/adddocumenttoclient", {
            ClientId,
            UploadedBy: "Client",
            Status: 1,
            ClientFile: `${ClientId}-${file.name}`,
            Description: `${docName} of ${ClientId}`,
            DocName: `${ClientId}-${file.name}`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            uploadClientImage();
        })
    }

    const deleteClientDocument = async (docId) => {
        await axios.post(baseURL + "/api/deletedocumentfromclient", {
            DocumentId: docId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            // getClientDocuments();
        })
    }

    const uploadClientImage = async () => {
        await axios.post(baseURL + "/api/uploadclientimage", {
            ClientFile: `${ClientId}-${file.name}`,
            clientimage: file
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            toggleUploadModal();
            getDocuments()
        })
    }

    const uploadFile = (event) => {
        const imgFile = event.target.files[0];

        const fileType = imgFile.type;
        if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'application/pdf') {
            setFile(imgFile);
            setErrorMessage(false);
        } else {
            setFile(null);
            setErrorMessage(true);
        }
    }

    useEffect(() => {

        const profileImgId = FileFinder(`profile_pic of ${ClientId}`, profileDocs, true);

        if (file) {
            if (FileFinder(`profile_pic of ${ClientId}`, profileDocs)) {
                deleteClientDocument(profileImgId).then(() => addProfileDocument())
            }
            else {
                addProfileDocument()
            }
        }
    }, [file])

    return (
        <div className="user_upload_modal_div">
            <label htmlFor={id} className={`dropzone_label ${className}`}>
                {content}
                <input id={id} type="file" onChange={uploadFile} />
            </label>
            {
                isErrorVisible && <p className='error-msg m-0'>{t("UserPanel.Home.InvalidFileType")}</p>
            }
        </div>
    )
}

export default DocumentUpload
