import React, { useRef, useState } from 'react'
import ReactSignatureCanvas from 'react-signature-canvas'
import Button1 from '../button1/Button1'
import { useTranslation } from 'react-i18next'
import "./SignaturePad.css"

const SignaturePad = ({ toggleModal, signatre }) => {

    const { t } = useTranslation();
    const signatureRef = useRef(null);

    const [imageFile, setImageFile] = useState(null);
    const [isClear, setIsClear] = useState(false);

    const clearSignature = () => {
        signatureRef.current.clear();
        setIsClear(false);
    }

    const handleSave = () => {
        const dataUrl = signatureRef.current.toDataURL('image/png');
        convertBase64ToFile(dataUrl.split(',')[1], 'signature.png', 'image/png');
        toggleModal();
    };

    const convertBase64ToFile = (base64String, fileName, fileType) => {
        const decodedData = atob(base64String);

        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: fileType });

        const convertedFile = new File([blob], fileName, { type: fileType });
        console.log(convertedFile);
        setImageFile(convertedFile);
        signatre([convertedFile])
    };

    return (
        <>
            <ReactSignatureCanvas penColor='black' ref={signatureRef}
                onBegin={() => setIsClear(true)}
                canvasProps={{ className: 'sigCanvas' }} />
            <div className="d-flex align-items-center justify-content-between mt-4 " style={{ width: '100%' }}>
                <Button1
                    onClick={isClear ? clearSignature : toggleModal}
                    text={isClear ? t("SignUp.Errors.Clear") : t("UserPanel.Cases.AddNewCasePage.Cancel")}
                    color="gray"
                />
                <Button1
                    text={t("UserPanel.Profile.Submit")}
                    className={`${!isClear ? "blurBtn" : ""}`}

                    onClick={() => handleSave()}
                />

                {/* {signatureImage && (
                    <div>
                        <p>Signature Image:</p>
                        <img src={signatureImage} alt="Signature" />
                    </div>
                )} */}
            </div>
        </>
    )
}

export default SignaturePad
