import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateFormatForServer from '../components/custom/DateFormatForServer';
import useSignUp from './useSignUp';


const useMeetSetupVerification = () => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');

  const navigate = useNavigate();
  const [isSuccessMsgVisible, setIsSuccessMsgVisible] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    date: '',
    adress: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedArray = localStorage.getItem('userInfo');

    if (storedArray) {
      const data = JSON.parse(storedArray);
      console.log(data);
      setFormData({
        ...formData,
        email: data.email,
        fullName: data.fullName,
        adress: data.adress,
        phoneNumber: data.phoneNumber,
        date: Date()
      })
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.email.trim() || !formData.date.trim()) {
      newErrors.fillAllFields = true;
    }
    else {
      const phoneRegex = /^(\+966|0)(5\d{8})$/;

      //const emailRegex = /^(\+966|0)(5\d{8})$/;

      // if (!formData.phoneNumber.trim().match(phoneRegex)) {
      //   newErrors.phoneNumber = true;
      // }

      // validate email
      // if (!formData.email.trim().match(emailRegex)) {
      //     newErrors.email = true;
      // }

      //validate date
      if (formData.date === '') {
        newErrors.date = true;
      }

      //validate date
      if (formData.fullName === '') {
        newErrors.fullName = true;
      }

    }

    setErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  }

  const bookMeeting = async () => {
    await axios.post(baseURL + "/api/addmeeting", {
      ClientName: formData.fullName,
      PhoneNo: formData.phoneNumber,
      Email: formData.email,
      MeetingDate: DateFormatForServer(formData.date),
      Address: formData.adress,
      Status: 0
    }).then(response => {
      console.log(response);
      if (response.data.response.status === true) {
        setIsSuccessMsgVisible(true)
        setTimeout(() => {
          navigate('/')
        }, 3000);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      bookMeeting();
    } else {
      console.log('Form contains errors, please correct them.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the form data based on the input type
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formData.profession === 'Non Doctor Medical Professional') {
      setFormData((prevData) => ({
        ...prevData,
        doctorType: '',
      }));
    }

  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSuccessMsgVisible
  };
};

export default useMeetSetupVerification;