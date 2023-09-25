import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteLikeAction,
  GetActivityIDAction,
  GetListActivityAction,
  PostLikeAction,
} from "../redux/actions/ActivityAction";
import styles from "./style.module.css";
import Slider from "react-slick";
import moment from "moment";
import { useFormik } from "formik";
import {
  CommentAction,
  CommentRepllyAction,
} from "../redux/actions/CommentAction";
import {
  FollowAction,
  JoinAction,
  UnFollowAction,
  UnJoinAction,
} from "../redux/actions/FollowJoinAction";
import Swal from "sweetalert2";
import { DonationAction } from "../redux/actions/DonationAction";
import { NavLink } from "react-router-dom";
import ShareActivity from "./ShareActivity";
import { SendEmail } from "../utils/emailService";
export default function DetailActivity(props) {
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
  const { userID } = useSelector((root) => root.LoginReducer);
  const [content, setContent] = useState("");
  const [onID, setOnID] = useState("");
  const [tcss, setTcss] = useState("css");
  const [commentI, setCommentI] = useState("commentContent");
  const { id } = props.match.params;
  const dispatch = useDispatch();

  const { activityById } = useSelector((root) => root.ActivityReducer);
  const endDate = moment(activityById?.endDate);
  const currentDate = moment();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customStyle: {
      backgroundColor: 'red',
      color: 'white',
      nextButton: {
        display: 'none'
      }
    }
  };
  settings.nextArrow = <style>{`
  .slick-next {
    position: absolute;
    right: -20px;
}
  }
  .slick-prev{
    // display: none!important;
  }
`}</style>;
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

  useEffect(() => {

     if (!localStorage.getItem('userID')) {
        Swal.fire({
            title: 'Thất bại!',
            text: 'Vui lòng đăng nhập để trải nghiệm tốt hơn!',
            icon: 'warning',
        }).then((result) => {
            props.history.push('')
    
        });
    }
    const action = GetActivityIDAction(id);
    dispatch(action);
  }, []);
  const [joinedIndex, setJoinedIndex] = useState(null);
  const [followIndex, setFollowIndex] = useState(null);
  const [isReadMore, setReadMore] = useState(false);
  const handleJoinClick = async (index, activity, isJoin, title,process) => {
    if (isJoin ==="Join") {
      setJoinedIndex(null);
      const action = UnJoinAction(activity, userID);
      dispatch(action);
     
    } else {
      setJoinedIndex(index);
      const action = JoinAction(activity, userID, title,process[0]?.location,process[0]?.startDate,process[0]?.endDate);
      dispatch(action);
      // SendEmail(
      //   localStorage.getItem("emailuser"),
      //   "Thông báo thời gian diễn ra chiến dịch",
      //   `Bạn đã tham gia thành công chiến dịch ${title} . Vui lòng đến địa chỉ ${
      //     process[0]?.location
      //   } từ ngày ${moment(process[0]?.startDate).format(
      //     "DD/MM/YYYY hh:mm A"
      //   )} đến ngày ${moment(process[0]?.endDate).format(
      //     "DD/MM/YYYY hh:mm A"
      //   )} để tham gia chiến dịch`
      // );
    }
    const action = GetListActivityAction();
    await dispatch(action);
    // setCmt((prevArray) => {
    //     const newArray = JSON.parse(JSON.stringify(prevArray));
    //     localStorage.getItem(`activity`, JSON.stringify(newArray));

    //     return newArray;
    // });
  };
  const slides = activityById?.media?.map((item, index) => {
    
    return (
      <div  style={settings.customStyle} key={index}>
        <img src={item?.linkMedia} alt="Slide 1" style={{width:'900px', height:'500px', marginLeft:'60px'}} />
      </div>
    );
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const openPopup = () => {
    setPopupOpen((open) => !open);
  };
  const formik1 = useFormik({
    initialValues: {
      title: "",
      amount: 0,
      email: localStorage.getItem("emailuser"),
      phone: "",
      name: localStorage.getItem("username"),
      isAnonymous: true,
      activityId: "",
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      const action = await DonationAction(value);
      await dispatch(action);
      setPopupOpen(false);
    },
  });
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
        // formik2.setFieldValue('commentIdReply', '');
        // setCommentI('commentContent')
        // setContent(true)
        setOnID("");
        formik2.setFieldValue("commentContent", "");
        formik2.setFieldValue("commentIdReply", "");
      }
    },
  });
  let isAlreadyLiked = false;
  let isAlreadyJoined = false;
  let isAlreadyFollowed = false;
  activityById?.like?.map((user) => {
    if (user.userId === userID) {
      //item?.like?
      isAlreadyLiked = true;
    }
  });

  activityById?.followJoinAvtivity?.map((user) => {
    if (user.userId === userID) {
      isAlreadyFollowed = user.isFollow;
      isAlreadyJoined = user.isJoin;
    }
  });
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
  const handleFollowClick = (index, activity, isFollow, title) => {
    // setCmt((prevArray) => {
    //     const newArray = JSON.parse(JSON.stringify(prevArray));
    //     newArray[index].isFollow = !newArray[index].isFollow;
    //     localStorage.setItem(`activity`, JSON.stringify(newArray));

    //     return newArray;
    // });
    if (isFollow) {
      setFollowIndex(null);
      const action = UnFollowAction(activity, userID);
      dispatch(action);
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
        icon: "error",
        title: `Bỏ theo dõi chiến dịch ${title} thành công `,
      });
    } else {
      setFollowIndex(index);
      const action = FollowAction(activity, userID);
      dispatch(action);
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
        title: `Theo dõi chiến dịch ${title} thành công `,
      });
    }
  };
  return (
    <div>
      <div className="fade-1 modal-1" id="img-comt">
      <div className="modal-dialog">
        <div className="modal-content" style={{ position: "relative" }}>
          {/* Modal Header */}
          <div className="modal-header" style={{ width: "100%" }}>
            <NavLink
              aria-current="page"
              className="logo active"
              to="/home"
              style={{ position: "absolute", left: "10px", top: "10px" }}
            >
              <img src="../images/logo.png" />
              <span>SVCW</span>
            </NavLink>

            <button
              type="button"
              className="close"
              data-dismiss="modal"
              style={{ position: "absolute", right: "22px", top: "20px" }}
              onClick={() => {
                props.history.goBack();
              }}
            >
              ×
            </button>
          </div>
          {/* Modal body */}
          <div className="modal-body" style={{ marginTop: "40px" }}>
            <div className="row merged">
              <div className="col-lg-9">
                <div className="pop-image">
                  <div className="pop-item">
                    <div className="action-block"></div>

                    <Slider {...settings} className={styles["slick-slider"]}>
                      {slides}
                    </Slider>
                    {/* <div
                      className=""
                      style={{
                        backgroundColor: `${isAlreadyLiked ? "rgb(117, 189, 240)" : "#eae9ee"
                          }`,
                        borderRadius: "4px",
                        color: "#82828e",
                        display: "inline-block",
                        fontSize: "13px",
                        padding: "5px 20px",
                        verticalAlign: "middle",
                        transition: "all 0.2s linear 0s",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleLikeClick(activityById.activityId);
                      }}
                    >
                      <div className="Like ">
                        <a className="Like__link">
                          <i className="icofont-like" /> Thích
                        </a>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="commentbar">
                  <div className="user" style={{display:'flex', marginBottom:'26px'}}>
                    <figure>
                      <img
                        src={
                          activityById?.user?.image === "none"
                            ? "../images/avatar.jpg"
                            : activityById?.user?.image
                        }
                        alt
                        width={40}
                        height={40}
                      />
                    </figure>
                    <div className="user-information">
                      <h4>
                        <a href="#" title>
                          {activityById?.user?.username}
                        </a>
                      </h4>
                      <span>{DateTime(activityById?.createAt)}</span>
                    </div>
                    {endDate.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <button
                  className={` ${
                    isAlreadyFollowed ? "btn-change" : "btn-color"
                  }  `}
                  style={{    position: "absolute",
                    right: "20px",
                    top: "15px"}}
                    onClick={() => {
                      handleFollowClick(
                        1,
                        activityById.activityId,
                        isAlreadyFollowed,
                        activityById.title
                      );
                    }}
                  >
                    {
                      //TODO
                    }
                    {isAlreadyFollowed ? "Hủy theo dõi" : "Theo dõi"}
                  </button>
                )}
                  
                  </div>
                  <div style={{ paddingLeft: "20px" }}>
                    <h3> {activityById?.title}</h3>
                    <p>
                    {isReadMore ? (
        activityById?.description?.length > 100 ? <>{activityById?.description} <span style={{ fontWeight: 'bold', color: "#2f3640" ,cursor:'pointer'}} onClick={() => setReadMore(false)}>...Thu gọn</span></> : <>{activityById?.description}</>
      ) : activityById?.description?.length > 100 ? (
        <>
          {activityById?.description.substring(0, 100)}
          <span style={{ fontWeight: 'bold', color: "#2f3640",cursor:'pointer' }} onClick={() => setReadMore(true)}>...Xem thêm</span>
        </>
      ) : (
        <>{activityById?.description}</>
      )}
                      </p>
                  </div>
                  {endDate.isBefore(currentDate) ? (
                <div></div>
              ) : (
                <div>
                  {activityById?.process?.map((pro, index) => {
                    if (
                      moment(pro.startDate, "YYYY-MM-DD hh:mm A").isBefore(
                        currentDate
                      ) &&
                      moment(pro.endDate, "YYYY-MM-DD hh:mm A").isAfter(currentDate)
                    ) {
                      if (pro.isParticipant === true) {
                        return (
                          <div style={{ padding: "30px 0 0 40px" }}>
                            Số người tham gia: {Number(pro?.realParticipant)}/
                            {Number(pro?.targetParticipant)}
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              )}
                 <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                className={
                  (activityById?.targetDonation !== 0
                    ? "marginform"
                    : "nomarginform") +
                  " " +
                  (activityById?.process?.length !== 0
                    ? "processform"
                    : "noprocessform")
                }
              >
                {endDate?.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <div>
                    {activityById?.process?.map((pro, index) => {
                      if (
                        moment(pro?.startDate, "YYYY-MM-DD hh:mm A").isBefore(
                          currentDate
                        ) &&
                        moment(pro?.endDate, "YYYY-MM-DD hh:mm A").isAfter(currentDate)
                      ) {
                        if (pro?.isParticipant === true) {
                          return (
                            <button
                              className={` ${
                                isAlreadyJoined === "Join" ? "btn-change" : "btn-color"
                              } mb-4 mt-4 btn-add ${
                                activityById.targetDonation !== 0
                                  ? "marginfollow"
                                  : "sas"
                              }`}
                              onClick={() => {
                                handleJoinClick(
                                  index,
                                  activityById.activityId,
                                  isAlreadyJoined,
                                  activityById.title,
                                  activityById?.process?.filter(
                                    (item) => item.processTypeId === "pt003"
                                  )
                                );
                              }}
                            >
                              {isAlreadyJoined === "Join" ? "Hủy Tham gia" : "Tham gia"}
                            </button>
                          );
                        }
                      }
                    })}
                  </div>
                )}

              
                {endDate.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <div>
                    {activityById?.process?.map((pro, index) => {
                      if (
                        moment(pro.startDate, "YYYY-MM-DD hh:mm A").isBefore(
                          currentDate
                        ) &&
                        moment(pro.endDate, "YYYY-MM-DD hh:mm A").isAfter(currentDate)
                      ) {
                        if (pro.isDonateProcess === true) {
                          return (
                            <button
                              className=" btn-color btn-donate"
                              onClick={() => {
                                // setActi(activityById.activityId)
                                formik1.setFieldValue(
                                  "activityId",
                                  activityById.activityId
                                );
                                openPopup();
                              }}
                            >
                              Ủng hộ
                            </button>
                          );
                        }
                      }
                    })}
                  </div>
                )}
                {activityById?.process?.length !== 0 ? (
                  <NavLink
                    to={`/detailprocess/${activityById?.activityId}`}
                    style={{
                      marginTop: "10x",
                    }}
                    className="btn-color mb-4 mt-4"
                    onClick={() => {
                      // handleClick2()
                      // const action = GetProcessByActivityAction(item.activityId);
                      // dispatch(action)
                    }}
                  >
                    Xem hoạt động
                  </NavLink>
                ) : (
                  <div></div>
                )}
              </div>
                  <div className="stat-tools" style={{  }}>
                    <div
                      className=""
                      style={{
                        backgroundColor: `${
                          isAlreadyLiked ? "rgb(117, 189, 240)" : "#eae9ee"
                        }`,
                        borderRadius: "4px",
                        color: `${
                          isAlreadyLiked ? "white" : "#82828e"
                        }`,
                        display: "inline-block",
                        fontSize: "13px",
                        padding: "5px 20px",
                        verticalAlign: "middle",
                        transition: "all 0.2s linear 0s",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleLikeClick(activityById?.activityId);
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
                    <div
                  className="share"
                  onClick={() => {
                    const textToCopy = `https://svcw-studentsvolunteer.vercel.app/detailactivity/${activityById?.activityId}`;

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
                </div>
                  </div>
                  <div className="new-comment" style={{ display: "block" }}>
                    <form
                      method="post"
                      onSubmit={formik2.handleSubmit}
                      style={{ position: "relative" }}
                    >
                      <div style={{ paddingBottom: "10px" }}>
                        {onID === activityById?.activityId ? (
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
                            <div
                              style={{ marginLeft: "10px" }}
                              className="textcmt"
                            >
                              {" "}
                              @{content}
                              {setOnID === activityById.activityId ? (
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
                      />
                      {onID === activityById?.activityId ? (
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
                              activityById?.activityId
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
                              activityById?.activityId
                            );
                          }}
                        >
                          <i className="icofont-paper-plane" />
                        </button>
                      )}
                      {activityById?.comment?.map((comment, index) => {
                        return (
                          <div className="comments-area">
                            <ul>
                              <li>
                                <figure>
                                  <img
                                    alt
                                    src={
                                      comment.user?.image === "none"
                                        ? "../images/avatar.jpg"
                                        : comment.user?.image
                                    }
                                  />
                                </figure>
                                <div className="commenter">
                                  <h5>
                                    <a title href="#">
                                      {comment.user?.username}
                                    </a>
                                  </h5>
                                  <span>{DateTime(comment.datetime)}</span>
                                  <p>{comment.commentContent}</p>
                                </div>
                                <a
                                  title="Reply"
                                  onClick={() => {
                                    formik2.setFieldValue(
                                      "commentIdReply",
                                      comment.commentId
                                    );
                                    // setCommentI('commentIdReply')
                                    setContent(comment.user?.username);
                                    setOnID(comment.activityId);
                                  }}
                                  className="reply-coment"
                                >
                                  <i className="icofont-reply" />
                                </a>
                              </li>
                              <li>
                                {comment.inverseReply?.map((item, index) => {
                                  return (
                                    <div key={index} className="ml-5">
                                      <figure>
                                        {" "}
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
                                        <h5>
                                          <a title href="#">
                                            {item.user?.username}{" "}
                                          </a>
                                        </h5>
                                        <span>{DateTime(item.datetime)}</span>
                                        <p>{item.commentContent}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </li>
                            </ul>
                          </div>
                        );
                      })}
                    </form>
                  </div>
                </div>
              </div>
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
