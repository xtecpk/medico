import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSignIn = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const checkToken = Cookies.get("token");

  const [formData, setFormData] = useState({
    PhoneNo: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});

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
      });
  };

  const googleSignin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      let userRole;
      console.log(codeResponse);
      const response = await axios.post(baseURL + "/api/googlelogin", {
        Token: codeResponse.access_token,
      });
      console.log(response);
      if (response.data.token) {
        const role = response.data.user.role;
        const token = response.data.token;
        const userId = response.data.user.uid;
        Cookies.set("userId", userId, { expires: 30 });
        Cookies.set("token", token, { expires: 30 });
        Cookies.set("role", role, { expires: 30 });
        if (role === "E") {
          userRole = "expert/cases";
        } else if (role === "A") {
          userRole = "admin/progress";
        } else if (role === "C") {
          getClientByUserId(userId, token);
        } else {
          userRole = undefined;
        }

        userRole && navigate(`/${userRole}`);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.PhoneNo.trim() || !formData.Password.trim()) {
      newErrors.fillAllFields = true;
    } else {
      // const phoneRegex = /^(\+966|0)(5\d{8})$/;
      // if (!formData.PhoneNo.match(phoneRegex)) {
      //   newErrors.PhoneNo = true;
      // }
      // Validate Password Length
      // if (formData.Password.length < 8) {
      //   newErrors.Password = true;
      //   newErrors.WrongCredentials = false
      // }
    }
    // newErrors.WrongCredentials = false

    setErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return newErrors;
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    let userRole;
    if (checkToken) Cookies.remove("token");
    Cookies.remove("userId");

    event.preventDefault();
    const errObj = validateForm();
    console.log(errObj);
    if (Object.keys(errObj).length === 0) {
      await axios
        .post(baseURL + "/api/login", {
          ...formData,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            const role = response.data.user.role;
            const token = response.data.token;
            const userId = response.data.user.uid;
            Cookies.set("userId", userId, { expires: 30 });
            Cookies.set("token", token, { expires: 30 });
            Cookies.set("role", role, { expires: 30 });
            if (role === "E") {
              userRole = "expert/cases";
            } else if (role === "A") {
              userRole = "admin/progress";
            } else if (role === "C") {
              getClientByUserId(userId, token);
            } else {
              userRole = undefined;
            }

            userRole && navigate(`/${userRole}`);
          }
        })
        .catch((error) => {
          console.log(error);
          setErrors({
            ...errors,
            Password: false,
            WrongCredentials: true,
          });
        });

      // if (!errObj.Password) {

      // }
      // Perform signup or submission logic
      console.log("Form is valid, submit the data:", formData);
    } else {
      console.log("Form contains errors, please correct them.");

      console.log(errors);
    }
    // console.log(response);
  };

  console.log(errors);
  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the form data based on the input type
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    googleSignin,
  };
};

export default useSignIn;
