import React from "react";
import { useTranslation } from "react-i18next";
import "./home.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="user_home">
      <h1>{t("UserPanel.Home.Heading")}</h1>
    </div>
  );
};

export default Home;
