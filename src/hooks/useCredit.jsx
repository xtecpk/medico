import axios from 'axios';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useCredit = () => {
  const service = useSelector(state => state.service.value)
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    cardType: 'Credit Card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    promocode: '',
  });
  const [userInfo, setUserInfo] = useState();

  const [credit, setCredit] = useState({
    amount: '',
    vat: '',
    total: ''
  });
  const [isAgreed, setIsAgreed] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service) {
      setCredit({
        amount: service.amount,
        vat: (service.amount * 0.15).toFixed(2),
        total: (service.amount * 1.15).toFixed(2)
      })
    }

    console.log(userInfo);
  }, [])

  const getClientByUserId = async (UserId, token) => {
    await axios.post(baseURL + "/api/getclientbyuserid", {
      UserId
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(response => {
      console.log(response);
      Cookies.set('clientId', response.data.response.data[0].ClientId, { expires: 30 })
      // naviagte("/user/packages")
    })
  }

  // const login = async () => {
  //   await axios.post(baseURL + "/api/login", {
  //     PhoneNo: PhoneNumber,
  //     Password: Password
  //   }).then(response => {
  //     console.log(response);
  //     if (response.status === 200) {
  //       const role = response.data.user.role;
  //       const token = response.data.token;
  //       const userId = response.data.user.uid;
  //       Cookies.set('userId', userId, { expires: 7 });
  //       Cookies.set('token', token, { expires: 30 });
  //       getClientByUserId(userId, token)
  //     }
  //   })
  // }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardType) {
      newErrors.cardType = true;
    }

    if (!formData.cardNumber.trim()
      //  || !formData.expiryMonth.trim() || !formData.expiryYear.trim() || !formData.cvv.trim()
    ) {
      newErrors.fillAllFields = true;
    }
    else {

      if (formData.cardNumber.length < 16) {
        newErrors.cardNumber = true;
      }

      //   if (formData.expiryMonth.length < 2) {
      //     newErrors.expiryMonth = true;
      //   }

      //   if (formData.expiryYear.length < 2) {
      //     newErrors.expiryYear = true;
      //   }

      //   if (formData.cvv.length < 3) {
      //     newErrors.cvv = true;
      //   }

    }

    if ((Object.keys(newErrors).length === 0) && !isAgreed) {
      newErrors.isAgreed = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const uploadSignature = async () => {
    const fileName = files[0].name.split(" ").join("");
    await axios.post(baseURL + "/api/login", {
      PhoneNo: userInfo.phoneNumber,
      Password: userInfo.password
    }).then(async (userResponse) => {
      console.log(userResponse);
      Cookies.set("role", "C", { expires: 30 });
      getClientByUserId(userResponse.data.user.uid, userResponse.data.token)
      await axios.post(baseURL + "/api/addusersignature", {
        UserId: userResponse.data.user.uid,
        ImageFile: `${userResponse.data.user.uid}_${fileName}`
      }, {
        headers: {
          'Authorization': 'Bearer ' + userResponse.data.token
        }
      }).then(async (res) => {
        console.log(res.data);
        if (res.data.response.status) {
          await axios.post(baseURL + "/api/uploadsignature", {
            ImageFile: `${userResponse.data.user.uid}_${fileName}`,
            signimage: files[0]
          }, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + userResponse.data.token
            }
          }).then(res => {
            console.log(res.data);
          })
        }
      })
    });

  }

  const proceedPayment = async () => {
    console.log(userInfo.email);
    await axios.post(baseURL + "/api/addpayment", {
      Amount: credit.total,
      Email: userInfo.email,
      ClientId: Cookies.get('clientId')
    }).then(response => {
      console.log(response.data);
      if (response.data.response.status) {
        Cookies.set('paymentId', response.data.response.data.paymentid, { expires: 1 })
        payment(response.data.response.data.paymentid);
      }
    })
  }

  const payment = async (OrderId) => {
    await axios.post(baseURL + "/api/initiatepayment", {
      Language: "en",
      OrderId,
      OrderAmount: credit.total,
      OrderCurrency: "SAR",
      OrderDescription: "Subscribe Package",
      Customer: {
        Name: userInfo.fullName,
        Email: userInfo.email,
        Phone: userInfo.phoneNumber,
        Address: {
          Line1: userInfo.adress.split("/")[0] || "line 1",
          City: userInfo.adress.split("/")[1] || "Riyadh",
          Country: userInfo.adress.split("/")[4] || "SA",
          State: userInfo.adress.split("/")[2] || "Riyadh",
          ZIP: userInfo.adress.split("/")[3] || "23423",
        }
      },
      Shipping: {
        Name: userInfo.fullName,
        Email: userInfo.email,
        Phone: userInfo.phoneNumber,
        Address: {
          Line1: userInfo.adress.split("/")[0] || "line 1",
          City: userInfo.adress.split("/")[1] || "Riyadh",
          State: userInfo.adress.split("/")[2] || "Riyadh",
          ZIP: userInfo.adress.split("/")[3] || "23423",
          Country: userInfo.adress.split("/")[4] || "SA",
        }
      }
    }).then(res => {
      console.log(res);
      res.status === 200 && (window.location.href = res.data)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      proceedPayment();
      console.log('Form is valid, submit the data:', formData);
      // naviagte('/signin')
      // login()
    } else {
      console.log('Form contains errors, please correct them.', errors);
    }
  };

  const applyPromo = async () => {

    const response = await axios.post(baseURL + "/api/getpromobycode", {
      Code: formData.promocode
    })

    console.log(response);
    let promoPercentage = response.data.response.data.length > 0 ? response.data.response.data[0].Percentage : 0;

    if (!promoApplied && promoPercentage !== 0) {
      setCredit({
        total: (credit.amount - credit.amount / 100 * promoPercentage).toFixed(2)
      })
      setPromoApplied(true);
      setErrors({

      })

      return;
    }
    else if (response.data.response.data.length === 0) {
      setErrors({
        promo: true
      })
      return;
    }
    else if (promoApplied) {
      setErrors({
        promoApplied: true
      })
    }

  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the form data based on the input type
    if (name === 'isAgreed') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: !formData.isAgreed,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

    }
  };

  return {
    formData,
    credit,
    errors,
    files,
    isAgreed,
    setIsAgreed,
    setFiles,
    setCredit,
    setUserInfo,
    handleChange,
    handleSubmit,
    applyPromo,
    uploadSignature,
  };
};

export default useCredit;