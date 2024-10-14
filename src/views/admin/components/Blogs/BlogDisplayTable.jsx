import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BlogDisplayTable = ({ labels, pageCasesToDisplay, path }) => {

    const navigate = useNavigate();

    const formatDate = (inputDateString) => {
        const inputDate = new Date(inputDateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return inputDate.toLocaleDateString('en-GB', options);
    }

    return (
        <>
            {pageCasesToDisplay?.length !== 0 ? (
                <table className="user_cases_display_table">
                    <thead>
                        <tr className="user_cases_display_table__head">
                            {labels?.map((label, index) => (
                                <th className="user_cases_display_table__label" key={index}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageCasesToDisplay.map((caseItem, index) => (
                            <tr key={index} className="user_cases_display_table__row" style={{ height: "6rem", cursor: "pointer" }}>
                                {/* {Object.keys(caseItem).map((data, dataIndex) =>
                                    dataIndex === 1 ?
                                        <Link className="w-100 d-block user_cases_display_table__cell_link" to={path + caseItem.id}>
                                            <td
                                                key={dataIndex}
                                                className="user_cases_display_table__cell">
                                                {caseItem[data]}
                                            </td>
                                        </Link>
                                        // :
                                        // dataIndex === 1 ? (
                                        //     <td key={dataIndex} className='tableImgTd'>
                                        //         <img src={caseItem[data]} alt="" />
                                        //     </td>
                                        // ) 
                                        :
                                        dataIndex === 2 ? (
                                            <td key={dataIndex} className='tableImgTd'>
                                                {formatDate(caseItem[data])}
                                            </td>
                                        )
                                            : (
                                                <td
                                                    key={dataIndex}
                                                    className="user_cases_display_table__cell">
                                                    {caseItem[data]}
                                                </td>
                                            )

                                )} */}
                                <td className="user_cases_display_table__cell memberActions">{caseItem.BlogId}</td>
                                <Link className="w-100 d-block user_cases_display_table__cell_link" to={path + caseItem.BlogId}>
                                    <td className="user_cases_display_table__cell memberActions">{caseItem.Title}</td>
                                </Link>
                                <td key={index} className='tableImgTd'>
                                    <img src={`https://app.rasanllp.com/medical/blog/${caseItem.BlogImage}`} alt="" />
                                </td>
                                <td className="user_cases_display_table__cell memberActions">{formatDate(caseItem.BlotTime)}</td>
                                <td className="user_cases_display_table__cell memberActions">{caseItem.Writer}</td>
                                <td className="user_cases_display_table__cell memberActions">{caseItem.BlogText}</td>
                                <td className="user_cases_display_table__cell memberActions">{caseItem.Status === 1 ? "Published" : "Draft"}</td>
                                <td className="user_cases_display_table__cell memberActions">
                                    <button style={{ color: "rgb(53, 115, 201)" }} onClick={() => navigate(path + caseItem.BlogId + "/edit")}>Edit</button> /
                                    <button style={{ color: "rgb(238, 51, 51)" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center">{"No Blogs Found"}</div>
            )}
        </>
    )
}

export default BlogDisplayTable
