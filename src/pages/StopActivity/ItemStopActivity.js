import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";

import { useFormik } from "formik";
import moment from "moment";
import PostDescription from "../../pages/Home/PostDescription";

import {
  CommentAction,
  CommentRepllyAction,
} from "../../redux/actions/CommentAction";
import { useEffect } from "react";

import ShareActivity from "../../components/ShareActivity";
import { GetProcessByActivityAction } from "../../redux/actions/ProcessAction";
import { DeleteLikeAction, PostLikeAction } from "../../redux/actions/ActivityAction";


export default function ItemStopActivity(props) {



  const [isReadMore, setReadMore] = useState(false);
  const [share, setShare] = useState(false);
  const [shareActivityID, setShareActivityID] = useState("");
  const handleClickShare = () => {
    setShare((prevIsOpen) => !prevIsOpen);
  };
  const popupStyleShare = {
    opacity: share ? 1 : 0,
    visibility: share ? "visible" : "hidden",
    overflow: share ? "auto" : "hidden",
  };
  const [isOpen, setIsOpen] = useState(false);
  const popupStyleCreate = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    overflow: isOpen ? "auto" : "hidden",
  };
  const [idActivity, setIDActivity] = useState("");
  const handleClickCreate = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const [isOpen1, setIsOpen1] = useState(false);
  const popupStyle1 = {
    opacity: isOpen1 ? 1 : 0,
    visibility: isOpen1 ? "visible" : "hidden",
    overflow: isOpen1 ? "auto" : "hidden",
  };

  const [isDonate, setIsDonate] = useState(false);
  const [listDonate, setIsListDonate] = useState([]);
  const handleClickDonate = () => {
    setIsDonate((prevIsOpen) => !prevIsOpen);
  };

  const popupStyleDonate = {
    opacity: isDonate ? 1 : 0,
    visibility: isDonate ? "visible" : "hidden",
    overflow: isDonate ? "auto" : "hidden",
  };
  const [isFolowJoin, setIsFolowJoin] = useState(false);
  const [listFolowJoin, setFolowJoin] = useState([]);
  const [listJoinFollow, setJoinFollow] = useState([]);
  const handleClickFolowJoin = () => {
    setIsFolowJoin((prevIsOpen) => !prevIsOpen);
  };

  const popupStyleFolowJoin = {
    opacity: isFolowJoin ? 1 : 0,
    visibility: isFolowJoin ? "visible" : "hidden",
    overflow: isFolowJoin ? "auto" : "hidden",
  };
  const handleClick1 = () => {
    setIsOpen1((prevIsOpen) => !prevIsOpen);
  };
  const dispatch = useDispatch();
  const { userID } = useSelector((root) => root.LoginReducer);
  const { reportType } = useSelector((root) => root.ReportType);
  const {
    ItemActivity,
    isAlreadyFollowed,
    isAlreadyJoined,
    isAlreadyLiked,
    detailItem,
    index,
    getUserId
  } = props;

  const [showAllComments, setShowAllComments] = useState(false);

  const handleShowAll = () => {
    setShowAllComments(true);
  };
  const CommentComponent = ({ item }) => {
    return (
      <div className="comments-area">
        <ul>
          <li>
            <figure>
              <img
                alt
                src={
                  item.user?.image === "none"
                    ? "../images/avatar.jpg"
                    : item.user?.image
                }
              />
            </figure>
            <div className="commenter">
              <h5 style={{ color: "rgb(8, 141, 205)" }}>
                {item.user?.username}
              </h5>
              <span>{DateTime(item.datetime)}</span>
              <p>{item.commentContent}</p>
            </div>
            <a
              title="Reply"
              onClick={() => {
                formik2.setFieldValue("commentIdReply", item.commentId);
                setContent(item.user?.username);
                setOnID(item.activityId);
              }}
              className="reply-coment"
            >
              <i className="icofont-reply" />
            </a>
          </li>
          <li>
            {item.inverseReply?.map((reply, index) => {
              return (
                <div key={index} className="ml-5">
                  <figure>
                    {" "}
                    <img
                      alt
                      src={
                        reply.user?.image === "none"
                          ? "../images/avatar.jpg"
                          : reply.user?.image
                      }
                    />
                  </figure>

                  <div className="commenter">
                    <h5 style={{ color: "rgb(8, 141, 205)" }}>
                      {reply.user?.username}{" "}
                    </h5>
                    <span>{DateTime(reply.datetime)}</span>
                    <p>{reply.commentContent}</p>
                  </div>
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  const visibleComments = showAllComments
    ? ItemActivity.comment
    : ItemActivity.comment.slice(0, 2);
  const [openpro1, setOpenPro1] = useState(false);
  const [detail, setDetail] = useState({});
  const [report, setReport] = useState(false);
  const [joinedIndex, setJoinedIndex] = useState(null);
  const [followIndex, setFollowIndex] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [onID, setOnID] = useState("");
  const [content, setContent] = useState("");
  const [tcss, setTcss] = useState("css");
  const [commentI, setCommentI] = useState("commentContent");
  const [reportid, setReportID] = useState("");


  const formik2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: userID,
      activityId: "",
      commentContent: "",
      status: true,
      commentIdReply: "",
    },
    onSubmit: (value) => {
      if (value.commentIdReply === "") {
        const action = CommentAction(value);
        dispatch(action);
        formik2.setFieldValue("commentContent", "");
      } else {
        const action = CommentRepllyAction(value);
        dispatch(action);
        setOnID("");

        formik2.setFieldValue("commentContent", "");
        formik2.setFieldValue("commentIdReply", "");
      }
    },
  });

  const DateTime = (item) => {
    const currentTime = moment();
    const inputTime = moment(item);
    const duration = moment.duration(currentTime.diff(inputTime));
    const hoursAgo = duration.asHours();
    let timeAgoString = "";
    if (hoursAgo < 1) {
      const daysAgo = Math.floor(duration.asMinutes());
      timeAgoString = `${daysAgo} phút trước`;
    } else if (hoursAgo >= 24) {
      const daysAgo = Math.floor(duration.asDays());
      timeAgoString = `${daysAgo} ngày trước`;
    } else {
      const hoursAgo = Math.floor(duration.asHours());
      timeAgoString = `${hoursAgo} giờ trước`;
    }
    return timeAgoString;
  };

 
  const handleLikeClick = (id) => {
    let alreadyLiked = isAlreadyLiked;

    let action = null;

    if (alreadyLiked) {
      action = DeleteLikeAction({
        userId: userID,
        activityId: id,
      });
    } else {
      action = PostLikeAction({
        userId: userID,
        activityId: id,
      });
    }
    dispatch(action);
  };


  const endDate = moment(ItemActivity.endDate);
  const currentDate = moment();
  return (
    <div>
      <div className="main-wraper">
        <div className="user-post">
          <div className="friend-info">
            <div style={{display:'flex'}}>
            <figure style={{marginRight:'6px'}}>
              <img
                style={{ height: "40px", width: "40px"  , borderRadius:'50%' }}
                alt
                src={
                  getUserId?.image === "none"
                    ? "../images/avatar.jpg"
                    : getUserId.image
                }
              />
            </figure>
           <div>
           <ins style={{textDecoration:'none'}}>
                <NavLink to={`/profile/${getUserId.userId}`} >
                  <h5 className="name-user">{getUserId.username}</h5>
                </NavLink>
              </ins>
              <span>
                {" "}
                {DateTime(ItemActivity.createAt)}{" "}
                <i className="icofont-globe" />
              </span>
           </div>
            </div>
            <div className="post-meta">
              <div className="row">
                <div
                  style={{
                    padding: "0",
                    display: "flex",
                    alignContent: "center",
                  }}
                  className="col-lg-12"
                >
                  <NavLink
                    to={`/detailactivity/${ItemActivity.activityId}`}
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      width: "450px",
                      wordWrap: "break-word",
                      color: "#088dcd",
                    }}
                    className="col-lg-12 name-user"
                  >
                    {ItemActivity?.title}
                  </NavLink>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    color: "#747d8c",
                    fontWeight: 400,
                    fontSize: "15px",
                  }}
                >
                  <span
                    style={{
                      color: "#747d8c",
                      fontWeight: 400,
                      fontSize: "15px",
                    }}
                  >
                    Thời gian:{" "}
                  </span>{" "}
                  {moment(ItemActivity.startDate).format("DD/MM/YYYY")}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "900",
                    padding: "0 0.5rem",
                  }}
                >
                  <span
                    style={{
                      color: "#747d8c",
                      fontWeight: 400,
                      fontSize: "15px",
                    }}
                  >
                    -
                  </span>
                </div>
                <div
                  style={{
                    color: "#747d8c",
                    fontWeight: 400,
                    fontSize: "15px",
                  }}
                >
                  {" "}
                  <span
                    style={{
                      color: "#747d8c",
                      fontWeight: 400,
                      fontSize: "15px",
                    }}
                  >
                    {" "}
                  </span>{" "}
                  {moment(ItemActivity.endDate).format("DD/MM/YYYY")}
                </div>
              </div>

              {/* chi tiết chiến dịch */}
              <p className="mt-3 mt-detail">
                <span className="mt-detail"></span>{" "}
                <PostDescription description={ItemActivity.description} />
              </p>


        
           
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                className={
                  (ItemActivity.targetDonation !== 0
                    ? "marginform"
                    : "nomarginform") +
                  " " +
                  (ItemActivity.process.length !== 0
                    ? "processform"
                    : "noprocessform")
                }
              >
               
              

             
                {ItemActivity.process.length !== 0 ? (
                  <NavLink
                    to={`/detailprocess/${ItemActivity.activityId}`}
                    style={{
                      marginTop: "10x",
                    }}
                    className="btn-color mb-4 mt-4"
                    onClick={() => {
                      // handleClick2()
                      const action = GetProcessByActivityAction(
                        ItemActivity.activityId
                      );
                      dispatch(action);
                    }}
                  >
                    Xem hoạt động
                  </NavLink>
                ) : (
                  <div></div>
                )}
              </div>

              <div className="we-video-info">
                <div
                  className="emoji-state"
                  style={{
                    display: "flex",
                    alignContent: "center",
                    paddingTop: "20px",
                  }}
                >
                  <div className="popover_wrapper">
                    <a className="popover_title" href="#" title>
                      <img alt src="../images/smiles/thumb.png" />
                    </a>
                    <div className="popover_content">
                      <span>
                        <img alt src="../images/smiles/thumb.png" />
                        Đã thích
                      </span>
                      <ul className="namelist">
                        {ItemActivity?.like?.length <= 4
                          ? ItemActivity?.like.map((userItem) => {
                              return <li>{userItem?.user?.username}</li>;
                            })
                          : ItemActivity?.like
                              ?.slice(0, 4)
                              .map((userItem, index) => {
                                index < 4 ? (
                                  <li>{userItem.user?.username}</li>
                                ) : (
                                  <li>
                                    <span>
                                      +{ItemActivity?.like.length - 5}
                                    </span>
                                  </li>
                                );
                              })}
                      </ul>
                    </div>
                  </div>

                  <p>{ItemActivity.like.length || 0}</p>
                  <div style={{ marginLeft: "20px" }}>
                    <div
                      style={{
                        fontSize: "15px",
                      }}
                      className="name-user"
                    >
                      <span style={{ paddingRight: "2px" }}>
                        {(ItemActivity?.comment?.length !== 0
                          ? ItemActivity?.comment?.length
                          : 0) +
                          (ItemActivity?.comment?.inverseReply
                            ? ItemActivity?.comment?.inverseReply?.length
                            : 0)}
                        <span style={{ paddingLeft: "3px" }}>bình luận</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stat-tools">
                <div
                  className=""
                  style={{
                    backgroundColor: `${
                      isAlreadyLiked ? "rgb(117, 189, 240)" : "#eae9ee"
                    }`,
                    borderRadius: "4px",
                    color: `${isAlreadyLiked ? "white" : "#82828e"}`,
                    display: "inline-block",
                    fontSize: "13px",
                    padding: "5px 20px",
                    verticalAlign: "middle",
                    transition: "all 0.2s linear 0s",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleLikeClick(ItemActivity.activityId);
                  }}
                >
                  <div className="Like ">
                    <a className="Like__link">
                      <i className="icofont-like" /> Thích
                    </a>
                  </div>
                </div>
                <div className="comment-to bg">
                  <i className="icofont-comment" /> Bình luận
                </div>
                {/* <div
                  className="share"
                  onClick={() => {
                    const textToCopy = `http://localhost:3000/detailactivity/${ItemActivity.activityId}`;

                    const copyTextToClipboard = () => {
                      const textArea = document.createElement("textarea");
                      textArea.value = textToCopy;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                    };

                    copyTextToClipboard();
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top-end",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                      },
                    });

                    Toast.fire({
                      icon: "success",
                      title: `Sao chép liên kết thành công`,
                    });
                  }}
                >
                  <i className="icofont-share-alt" /> Chia sẻ
                </div> */}
              </div>
              <div className="new-comment" style={{ display: "block" }}>
                <form
                  method="post"
                  onSubmit={formik2.handleSubmit}
                  style={{ position: "relative" }}
                >
                  <div style={{ paddingBottom: "10px" }}>
                    {onID === ItemActivity.activityId ? (
                      <div
                        className="commentT"
                        style={{
                          display: "flex",
                          alignContent: "center",
                        }}
                      >
                        <span style={{ paddingTop: "6px" }}>
                          Trả lời bình luận :{" "}
                        </span>
                        <div style={{ marginLeft: "10px" }} className="textcmt">
                          {" "}
                          @{content}
                          {setOnID === ItemActivity.activityId ? (
                            <span
                              style={{
                                color: "red",
                                fontSize: "18px",
                                cursor: "pointer",
                                paddingLeft: "4px",
                              }}
                              onClick={() => {
                                setOnID("");
                                setTcss("35px");
                              }}
                            >
                              x
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "red",
                                fontSize: "18px",
                                cursor: "pointer",
                                paddingLeft: "4px",
                              }}
                              onClick={() => {
                                setOnID("");
                                setTcss("10px");
                              }}
                            >
                              x
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          paddingTop: "6px",
                          paddingBottom: "10px",
                        }}
                      ></div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder=""
                    value={formik2.values.commentContent}
                    name={commentI}
                    onChange={formik2.handleChange}
                    className="input-comment"
                    disabled
                    style={{background:'#f2eded'}}
                  />
                  {onID === ItemActivity.activityId ? (
                    <button
                      style={{
                        position: "absolute",
                        top: "52px",
                      }}
                      type="submit"
                      onClick={async () => {
                        // await setTextI(item.activityId)
                        formik2.setFieldValue(
                          "activityId",
                          ItemActivity.activityId
                        );
                      }}
                    >
                      <i className="icofont-paper-plane" />
                    </button>
                  ) : (
                    <button
                      style={{
                        position: "absolute",
                        top: "40px",
                      }}
                      type="submit"
                      onClick={async () => {
                        // await setTextI(item.activityId)
                        formik2.setFieldValue(
                          "activityId",
                          ItemActivity.activityId
                        );
                      }}
                    >
                      <i className="icofont-paper-plane" />
                    </button>
                  )}
                  {visibleComments.map((item, index) => (
                    <CommentComponent key={index} item={item} />
                  ))}
                  {ItemActivity.comment.length > 2 && !showAllComments && (
                    <div
                      onClick={handleShowAll}
                      className=""
                      style={{ color: "rgb(8, 141, 205)", cursor: "pointer" }}
                    >
                      Xem thêm...
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
     
     
      <ShareActivity
        share={share}
        handleClickShare={handleClickShare}
        popupStyleShare={popupStyleShare}
        activityId={shareActivityID}
      />
     
      
    </div>
  );
}
