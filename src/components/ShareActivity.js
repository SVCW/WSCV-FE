import React, { useState } from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

export default function ShareActivity (props) {
    const { share, handleClickShare, popupStyleShare, activityId } = props;
    const textToCopy =`http://localhost:3000/detailactivity/${activityId}`;
    const [textToCopy1, setTextToCopy1] = useState(true);
    const copyTextToClipboard = () => {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
       setTextToCopy1(false)
      };
    return (
        <div>
            {share === true ? (
                <div className="post-new-popup" style={popupStyleShare}>
                    <div
                        className="popup"
                        style={{ width: 800, marginTop: '0px', zIndex: 80, height:'250px' }}
                    >
                        <span className="popup-closed" onClick={()=>{
                            handleClickShare()
                            setTextToCopy1(true)
                        }}>
                            <i className="icofont-close" />
                        </span>
                        <div className="popup-meta">
                            <div className="popup-head">
                                <h5>
                                    <i>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-plus"
                                        >
                                            <line x1={12} y1={5} x2={12} y2={19} />
                                            <line x1={5} y1={12} x2={19} y2={12} />
                                        </svg>
                                    </i>
                                    Chia sẻ bài viết
                                </h5>
                            </div>
                        </div>

                        <div className="" style={{ textAlign: 'center', fontSize: '20px', paddingTop: '50px' }}>
                            <NavLink to={`/detailactivity/${activityId}`}>
                                {`https://svcw-system.azurewebsites.net/api/detailactivity/${activityId}`}

                            </NavLink>
                            <button style={{position:'absolute',
                        right:'10px',bottom:'20px',border:'none',display: "inline-block",
                        fontSize: "18px",
                        fontWeight: 500,
                        marginBottom: 0,
                        color:'#3f6ad8'
                        }} onClick={copyTextToClipboard}>{textToCopy1 ? "Sao chép liên kết" :"Đã sao chép liên kết"}</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}
