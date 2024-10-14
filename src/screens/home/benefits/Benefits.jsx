import React, { useEffect, useRef, useState } from "react";
import "./benefits.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import benefitsBgLeft from "../../../assets/home/benefits-bg-left.svg";
import benefitsBgRight from "../../../assets/home/benefits-bg-right.svg";
import image1 from "../../../assets/home/image1.webp";
import image2 from "../../../assets/home/image2.jpg";
import image3 from "../../../assets/home/RASAN5.jpg";

const Benefits = () => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);

  const imageRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-left");
        } else {
          entry.target.classList.remove("animate-left");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection);

    imageRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-up");
        } else {
          entry.target.classList.remove("animate-up");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection);

    textRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center .benefits-outer-container mt-5">
      <div className="benefits-container d-flex flex-column justify-content-center gap-5 mt-5">
        <div className="benefits-heading d-flex justify-content-center">
          <h2 className="text-center">{t("Home.Benefits.BenefitsHeading")}</h2>
        </div>
        {[0, 1, 2].map((benefit, index) => {
          return (
            <div
              className={`benefit-item d-flex justify-content-center gap-5 align-items-center mt-5 ${
                benefit % 2 == 0 ? "" : "reverse"
              }`}
              key={index}
            >
              <div
                ref={(el) => (imageRefs.current[index] = el)}
                className={`benefit-image `}
              >
                <img
                  src={index === 0 ? image1 : index === 1 ? image2 : image3}
                  alt=""
                  className=""
                />
              </div>
              <div
                ref={(el) => (textRefs.current[index] = el)}
                className="benefit-text d-flex flex-column gap-3"
              >
                <h3
                  className={`benefit-heading ${
                    lang == "en" ? "" : "text-end"
                  }`}
                >
                  {t(`Home.Benefits.Benefit.${benefit}.Heading`)}
                </h3>
                <p
                  className={`benefit-subheading ${
                    lang == "en" ? "" : "text-end"
                  }`}
                >
                  {t(`Home.Benefits.Benefit.${benefit}.Subheading`)}
                </p>
                {index == 2 &&
                  [0, 1].map((membership) => {
                    return (
                      <>
                        <p>
                          <b>
                            {t(
                              `Home.Benefits.Benefit.${benefit}.Membership.Heading${
                                membership + 1
                              }`
                            )}
                          </b>{" "}
                          {t(
                            `Home.Benefits.Benefit.${benefit}.Membership.Deascription${
                              membership + 1
                            }`
                          )}
                        </p>
                      </>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Benefits;
