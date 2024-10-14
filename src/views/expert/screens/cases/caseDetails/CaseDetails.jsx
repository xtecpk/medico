import axios from 'axios';
import React, { useEffect, useState } from "react";
import "./caseDetails.css";
import {
  Button1,
  CaseDetailsTable,
  ExpertDisplay,
  H2,
  H3,
  H4,
  Modal,
} from "../../../components";
import { CardLayout } from "../../../containers";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { plusIcon } from '../../../assets';
import { Dropzone } from '../../../../user/components';
import { Pdf } from '../../../../user/components';

const CaseDetails = ({ setChatCaseId }) => {
  const caseId = useParams().caseId;
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token')
  const ExpertId = Cookies.get('ExpertId')
  const navigate = useNavigate()

  const [currCase, setCurrCase] = useState({});
  const [client, setClient] = useState({});
  const [experts, setExperts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const optionChangeHandler = (e) => {
    setCurrCase({
      ...currCase,
      status: e.target.value,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const getCaseDetails = async () => {
    await axios.post(baseURL + "/api/getcasebyid", {
      CaseId: caseId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      setCurrCase(response.data.response.data[0])
    })
  }

  const getClientBYId = async () => {
    await axios.post(baseURL + "/api/getclientbyid", {
      ClientId: currCase.ClientId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setClient(response.data.response.data[0])
    })
  }

  useEffect(() => {
    getCaseDetails().then(getClientBYId());
  }, [])

  const getCientInfo = async () => {
    await axios.post(baseURL + "/api/getexpertclientbycase", {
      CaseId: caseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setExperts(res.data.response.data)
    })
  }

  useEffect(() => {
    getCientInfo();
    getcasedocument();
  }, [])

  const getcasedocument = async () => {
    await axios.post(baseURL + "/api/getcasedocument", {
      CaseId: caseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      console.log(res);
      setDocuments(res.data.response.data)
    })
  }

  const deleteDocumentFromCase = async (DocumentId) => {
    await axios.post(baseURL + "/api/deletedocumentfromcase", {
      DocumentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(() => {
      getcasedocument()
    })
  }

  const addCaseFile = async () => {
    const fileName = files[0].name.split(" ").join("");
    await axios.post(baseURL + "/api/adddocumenttocase", {
      CaseId: caseId,
      DocName: fileName,
      UploadedBy: ExpertId,
      CaseFile: fileName,
      Status: 1,
      Description: "Documnet By Expert",
      Role: "Expert",
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      console.log(res);
      uploadCaseDocument(fileName);
    })
  }

  const uploadCaseDocument = async (CaseFile) => {
    await axios.post(baseURL + "/api/uploaddocumentimage", {
      CaseFile,
      docimage: files[0]
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log(response)
      toggleModal()
      setFiles([])
      getcasedocument()
    })
  }


  useEffect(() => {
    files.length > 0 && addCaseFile()
  }, [files])



  return (
    <>
      <div className={`expert_caseDetails_outer`}>
        <H2 text={"Case Details"} />
        <CardLayout className="expert_caseDetails__card p-md-5 ">
          <div className="expert_caseDetails__left">
            <div className="expert_caseDetails__cases_div">
              <div className="user_caseDetails__cases_div__header">

                <H4 text={"Case"} />
                <Button1
                  className='px-5 py-2'
                  onClick={() => {
                    setChatCaseId(caseId);
                    navigate("/expert/cases-chat");
                  }}
                  text={"Chat"}
                />
              </div>
              <CaseDetailsTable
                labels={["name", "type", "status"]}
                values={currCase && [currCase.CaseName, currCase.CaseType, currCase.Status]}
                optionsLabel={"status"}
                onOptionChange={optionChangeHandler}
                selectValue={currCase && currCase.Status}
                options={[
                  // "New",
                  // "Opened",
                  // "Under Review",
                  // "In Progress",
                  // "Closed",
                  // "Won",
                  // "Lost",
                  currCase && currCase.Status
                ]}
              />
            </div>
            <div className="expert_caseDetails__clients_div">
              <H4 text={"Client"} />
              <CaseDetailsTable
                labels={["name", "type", "speciality", "experience"]}
                values={experts.length > 0 && [
                  experts[0].ClientName,
                  experts[0].Type,
                  experts[0].Speciality,
                  experts[0].Experience,
                ]}
              />
            </div>
            <div className="expert_caseDetails__experts_div">
              <H4 text={"Experts"} />
              <div className="expert_caseDetails__experts_div__inner">
                {experts.length > 0 ? experts.map(({ ExpertName, Expertise }, index) => (
                  <ExpertDisplay
                    key={index}
                    expertName={ExpertName}
                    areaOfExpertise={Expertise || ""}
                  />
                )) : <p>No Experts Found</p>}
              </div>
            </div>
          </div>
          <div className="user_caseDetails__right">
            <H3
              text={"Documents"}
              className="text-xl-center "
            />
            <div>
              <div className="user_addNewCase_form__documnets_div__top">
                <h5>ADMIN</h5>
              </div>
              {
                documents.filter(doc => doc.Role.toLowerCase() === "admin").length > 0 ?
                  documents.filter(doc => doc.Role.toLowerCase() === "admin").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>No Document Found</p>
              }

            </div>
            <div>
              <h5>{"User"}</h5>
              {
                documents.filter(doc => doc.Role === "Client").length > 0 ?
                  documents.filter(doc => doc.Role === "Client").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>No Document Found</p>
              }
            </div>
            <div>
              <div className="user_addNewCase_form__documnets_div__top">
                <h5>{"Expert"}</h5>
                <button>
                  <img src={plusIcon} alt="plus icon" width={12} onClick={toggleModal} />
                </button>
              </div>
              {
                documents.filter(doc => doc.Role === "Expert").length > 0 ?
                  documents.filter(doc => doc.Role === "Expert").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>No Document Found</p>
              }
            </div>
          </div>
        </CardLayout>
        {isModalVisible && (
          <Modal toggleModal={toggleModal}>
            <div className="user_submit_modal">
              <div>
                <Dropzone
                  files={files}
                  setFiles={setFiles}
                  content={"Click to Upload Document +"}
                />
                {
                  files && files.map((file) => {
                    return <Pdf downloadStatus={false} key={file.name} name={file.name} size={file.size} />
                  })
                }
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleModal}
                text={"Cancel"}
                color="gray"
              />
              <Button1
                text={"Submit"}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default CaseDetails;
