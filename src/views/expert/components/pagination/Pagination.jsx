import React from "react";
import "./pagination.css";
import { chevronLeftIcon, chevronRightIcon } from "../../assets";

const Pagination = ({
  recordsToDisplay,
  recordsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pagesCount = Math.ceil(recordsToDisplay.length / recordsPerPage);

  const paginationRightLeftHandler = (value) => {
    const newPage = currentPage + value;
    if (newPage > 0 && newPage <= pagesCount) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    for (let number = 1; number <= pagesCount; number++) {
      if (
        number === 1 ||
        number === pagesCount ||
        (number >= currentPage - 1 && number <= currentPage + 1)
      ) {
        buttons.push(
          <PaginationRadio
            key={number}
            idHtmlFor={`page${number}`}
            name="page"
            number={number}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );
      } else if (
        (number === currentPage - 2 && currentPage > 3) ||
        (number === currentPage + 2 && currentPage < pagesCount - 2)
      ) {
        buttons.push(<span key={number}>...</span>);
      }
    }
    // ../
    return buttons;
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3">
        <button
          className="pagination_left_btn"
          onClick={() => paginationRightLeftHandler(-1)}
        >
          {}
          <img src={chevronLeftIcon} alt="chevron left" width={8} />
        </button>
        {renderPaginationButtons()}
        <button
          className="pagination_right_btn"
          onClick={() => paginationRightLeftHandler(1)}
        >
          <img src={chevronRightIcon} alt="chevron right" width={8} />
        </button>
      </div>
    </>
  );
};

export default Pagination;

const PaginationRadio = ({
  idHtmlFor,
  number,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <>
      <label
        htmlFor={idHtmlFor}
        className={`pagination_radio_label ${
          currentPage === number ? "pagination_radio_label-checked" : " "
        }`}
      >
        <span>{number}</span>
        <input
          onChange={() => setCurrentPage(number)}
          defaultChecked={currentPage === number}
          type="radio"
          id={idHtmlFor}
          name={"expert_cases_pagination"}
        />
      </label>
    </>
  );
};
