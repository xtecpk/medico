import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { profession } from "../features/profession/professionSlice";
import Cookies from "js-cookie";

const useSignUp = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [isGoogleSignin, setIsGoogleSignin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profession: "",
    doctorType: "Non-Surgeon",
    isAestheticGroup: "No",
    isExistingCase: "",
    adress: "",
  });

  const [errors, setErrors] = useState({});

  const isNext = () => {
    const newErrors = {};

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      // !formData.adress.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      newErrors.fillAllFields = true;
    } else {
      // const phoneRegex = /^(?:\+966)?(?:00966)?(?:05)?[0-9]{8}$/;
      // if (!formData.phoneNumber.trim().match(phoneRegex)) {
      if (!formData.phoneNumber.length > 10) {
        newErrors.phoneNumber = true;
      }

      if (formData.password.length < 8) {
        newErrors.password = true;
      } else {
        // Validate Confirm Password
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = true;
        }
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      // !formData.adress.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      newErrors.fillAllFields = true;
    } else {
      // Validate Password Length
      if (formData.password.length < 8) {
        newErrors.password = true;
      } else {
        // Validate Confirm Password

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = true;
        }
      }
    }
    // Validate Profession
    if (!formData.profession) {
      newErrors.profession = true;
    } else if (formData.profession === "Doctor" && formData.doctorType === "") {
      newErrors.doctorType = true;
    } else if (
      formData.doctorType === "Surgeon" &&
      formData.isAestheticGroup === ""
    ) {
      newErrors.isAestheticGroup = true;
    }

    // Additional validation based on experience
    if (!formData.isExistingCase) {
      newErrors.existingCase = true;
    }

    setErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const generateOTP = async () => {
    await axios
      .post(baseURL + "/api/generateOTP", {
        PhoneNo: formData.phoneNumber,
        Email: formData.email,
      })
      .then((res) => {
        console.log(res);
        navigate("verification");
      });
  };

  const getClientByUserId = async (UserId, token) => {
    await axios
      .post(
        baseURL + "/api/getclientbyuserid",
        {
          UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.response.status) {
          Cookies.set("clientId", response.data.response.data[0].ClientId, {
            expires: 30,
          });
          Cookies.set("profession", response.data.response.data[0].Type, {
            expires: 30,
          });
          Cookies.set("clientName", response.data.response.data[0].ClientName, {
            expires: 30,
          });
          navigate("/user/packages");
        }
      });
  };

  const login = async () => {
    await axios
      .post(baseURL + "/api/login", {
        PhoneNo: formData.phoneNumber,
        Password: formData.password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const role = response.data.user.role;
          const token = response.data.token;
          const userId = response.data.user.uid;
          Cookies.set("userId", userId, { expires: 7 });
          Cookies.set("token", token, { expires: 30 });
          Cookies.set("role", "C", { expires: 30 });
          getClientByUserId(userId, token);
        }
      });
  };

  const createUser = async (Type) => {
    console.log(formData);
    await axios
      .post(baseURL + "/api/signup", {
        PhoneNo: formData.phoneNumber,
        Email: formData.email,
        ClientName: formData.fullName,
        UserPassword: formData.password,
        ExistingCase: formData.isExistingCase === "No" ? 0 : 1,
        Type,
        Address: formData.adress,
      })
      .then((res) => {
        console.log(res);
        if (res.data.response.status) {
          Cookies.set("PhoneNumber", formData.phoneNumber, { expires: 1 });
          Cookies.set("Email", formData.email, { expires: 1 });
          Cookies.set("Password", formData.password, { expires: 1 });
          console.log(res);
          console.log("otp");
          if (isGoogleSignin) {
            login();
          } else {
            generateOTP();
          }
        } else {
          const { message } = res.data.response.data;
          const errorsObj = {};
          if (message.includes("Email_UNIQUE")) {
            errorsObj.copyEmail = true;
          } else {
            errorsObj.copyPhNo = true;
          }
          setErrors(errorsObj);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userType = () => {
    let type = "";
    if (formData.isAestheticGroup === "Yes") return (type = "Aesthetic-Group");
    if (formData.profession === "Doctor") {
      if (formData.doctorType === "Surgeon") {
        type = "Surgeon";
      } else {
        type = "Non-Surgeon";
      }
    } else {
      type = "Non-Doctor";
    }

    return type;
  };

  const verifySignUpToken = async () => {
    if (!isGoogleSignin) return;
    try {
      const response = await axios.post(baseURL + "/api/googlesignup", {
        Token: isGoogleSignin,
      });

      console.log(response);

      if (response.data.response.status) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const docType = userType();
    Cookies.set("profession", docType, { expires: 1 });
    console.log(docType);
    if (validateForm()) {
      localStorage.setItem("userInfo", JSON.stringify(formData));

      if (formData.isExistingCase === "Yes") {
        localStorage.setItem("userInfo", JSON.stringify(formData));
        navigate("meet-setup");
      } else {
        createUser(docType).then(verifySignUpToken);
      }
    } else {
      console.log("Form contains errors, please correct them.", errors);
    }

    // signup
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the form data based on the input type
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formData.profession === "Non Doctor Medical Professional") {
      setFormData((prevData) => ({
        ...prevData,
        doctorType: "",
      }));
    }
  };

  return {
    formData,
    errors,
    setFormData,
    handleChange,
    handleSubmit,
    isNext,
    isGoogleSignin,
    setIsGoogleSignin,
  };
};

export default useSignUp;
