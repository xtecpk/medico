import React, { useEffect, useState } from "react";
import { Button1, H3, Modal } from "../../components";
import { useTranslation } from "react-i18next";
import ticket from "../../../../assets/signup/ticket.svg";
import { useSelector } from "react-redux";
import useCredit from "../../../../hooks/useCredit";

const CardPaymentModal = ({
  toggleModal,
  selectedPkg,
  setAmount,
  amount = 0,
  makePayment,
}) => {
  const lang = useSelector((state) => state.language.value);
  const { t } = useTranslation();

  const { errors, handleChange, applyPromo, promoPercentage } = useCredit();

  useEffect(() => {
    setAmount(selectedPkg.Fee - (selectedPkg.Fee * promoPercentage) / 100);
  }, [promoPercentage]);

  return (
    <>
      <Modal toggleModal={toggleModal}>
        <div className="user_createTicketForm">
          <div className="user_createTicketForm">
            <H3
              text={t("UserPanel.Billing.CardPayment")}
              className="text-center"
            />

            <div className="">
              <h6 className="">
                <b>{selectedPkg && selectedPkg.PackageName}</b>
                <br /> Package for {selectedPkg && selectedPkg.UserType}
              </h6>
              <div className="credit-subtotal">
                <span className="amount-label mb-2">
                  {t("SignUp.Subtotal")} :{" "}
                </span>
                <span className="amount">{amount}</span>
              </div>
              {/* <div className='cerdit-vat mt-2'>
                <span className='amount-label mb-2'>VAT (15%) :  </span><span className='amount'>{!isNaN(credit.vat) && credit.vat}</span>
              </div> */}
              <div className="d-flex align-items-center gap-2 my-2">
                <img src={ticket} alt="ticket" />
                <span className="card-input-label">
                  {t("SignUp.PromoCode")}
                </span>
                <input
                  type="text"
                  name="promocode"
                  onChange={handleChange}
                  placeholder={t("SignUp.PromoCode")}
                  className="credit-input-promo p-2"
                />
                <button className="promo-btn" onClick={applyPromo}>
                  {t("SignUp.Apply")}
                </button>
              </div>
              {errors.promo && (
                <p
                  className={`text-danger error-msg ${
                    lang === "en" ? "" : "text-end"
                  }`}
                >
                  {t("Credit.Errors.InvalidPromo")}
                </p>
              )}
              {errors.promoApplied && (
                <p
                  className={`text-danger error-msg ${
                    lang === "en" ? "" : "text-end"
                  }`}
                >
                  {t("Credit.Errors.PromoAplied")}
                </p>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-end mt-2 ">
              <Button1
                onClick={toggleModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
                className="mx-3"
              />
              <Button1
                onClick={makePayment}
                text={t("UserPanel.Billing.MakePayment")}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardPaymentModal;
