import React, { useState } from "react";
import "./expertPicCard.css";
import { expertIcon } from "../../assets";

const ExpertPicCard = () => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  return (
    <>
      <div className={`expert_pic_card_outer `}>
        <button
          className={`expert_pic_card`}
          onClick={() => setIsCardExpanded((prevState) => !prevState)}>
          <img src={expertIcon} alt="expert name" width={30} />
        </button>
        {isCardExpanded && (
          <div className="expert_pic_card__dropdown border p-1">
            <button>{"Logout"}</button>
            <hr />
            <button>{"Edit Profile"}</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpertPicCard;
