import React from "react";
import "./linkButton1.css";
import { Link } from "react-router-dom";

const LinkButton1 = ({ text, to, icon = null }) => {
  return (
    <>
      <Link to={to} className="expert_link_button1">
        {icon && <img src={icon} alt={text} />}
        <span>{text}</span>
      </Link>
    </>
  );
};

export default LinkButton1;
