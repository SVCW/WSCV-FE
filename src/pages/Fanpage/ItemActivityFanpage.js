import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteActivityByUserAction,
  DeleteLikeAction,
  GetActivityByIDAction,
  GetActivityIDAction,
  GetListActivityAction,
  GetListEndActivityIDAction,
  GetQRActivityAction,
  PostLikeAction,
} from "../../redux/actions/ActivityAction";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { GetListReportTypeAction } from "../../redux/actions/ReportTypeAction";
import { useFormik } from "formik";
import { DonationAction } from "../../redux/actions/DonationAction";
import {
  CommentAction,
  CommentRepllyAction,
} from "../../redux/actions/CommentAction";
import { CreateReportAction } from "../../redux/actions/ReportAction";
import moment from "moment";
import {
  FollowAction,
  JoinAction,
  UnFollowAction,
  UnJoinAction,
} from "../../redux/actions/FollowJoinAction";
import PostDescription from "../Home/PostDescription";
import { history } from "../../App";
import UpdateActivity from "../../components/UpdateActivity";
import ReportActivity from "../../components/ReportActivity";
import ShareActivity from "../../components/ShareActivity";
import Game from "../../components/Game";
import Donate from "../../components/Donate";
import { SendEmail } from "../../utils/emailService";
import RejectActivi from "../../components/RejectActivi";
import ResultActivity from "../Result/ResultActivity";

export default function ItemActivityFanpage(props) {
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
    fanpageId,
  } = props;

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
  const [donate ,setDonate] = useState('')
  const handleClick6 = () => {
    setOpenPro1((prevIsOpen) => !prevIsOpen);
  };
  const openPopup = () => {
    setPopupOpen( (prevIsOpen) => !prevIsOpen)
    const action2 = {
      type: "DONATE",
      message: "",
    };
    dispatch(action2);
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
  const handleClick = () => {
    setReport((prevIsOpen) => !prevIsOpen);
  };
  const popupStyle3 = {
    opacity: report ? 1 : 0,
    visibility: report ? "visible" : "hidden",
    overflow: report ? "auto" : "hidden",
  };
  const [isDonate, setIsDonate] = useState(false);
  const [listDonate, setIsListDonate] = useState([]);
  const [isFolowJoin, setIsFolowJoin] = useState(false);
  const [listFolowJoin, setFolowJoin] = useState([]);
  const [listJoinFollow, setJoinFollow] = useState([]);
  const handleClickFolowJoin = () => {
    setIsFolowJoin((prevIsOpen) => !prevIsOpen);
  };
  useEffect(() => {
    const action4 = GetListReportTypeAction();
    dispatch(action4);
  }, []);
  const [isOpen1, setIsOpen1] = useState(false);
  const popupStyle1 = {
    opacity: isOpen1 ? 1 : 0,
    visibility: isOpen1 ? "visible" : "hidden",
    overflow: isOpen1 ? "auto" : "hidden",
  };

  const handleClick1 = () => {
    setIsOpen1((prevIsOpen) => !prevIsOpen);
  };
  const arrReportType = reportType?.map((item, index) => {
    return {
      label: item.reportTypeName,
      value: item.reportTypeId,
    };
  });
  const handleClickDonate = () => {
    setIsDonate((prevIsOpen) => !prevIsOpen);
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
  const [actireject, setActiReject] = useState(false);
  const [actirejectid, setActiRejectid] = useState("");
  const popupStyleActiReject = {
    opacity: actireject ? 1 : 0,
    visibility: actireject ? "visible" : "hidden",
    overflow: actireject ? "auto" : "hidden",
  };
  const handleClickActiReject = () => {
    setActiReject((prevIsOpen) => !prevIsOpen);
  };
  const formik6 = useFormik({
    initialValues: {
      reportId: "string",
      title: "string",
      reason: "",
      reportTypeId: "string",
      description: "string",
      status: true,
      userId: userID,
      activityId: reportid,
    },
    onSubmit: async (value) => {
      const action = await CreateReportAction(value);
      await dispatch(action);
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
        title: `Báo cáo chiến dịch thành công `,
      });
      setReport((prevIsOpen) => !prevIsOpen);
    },
  });
  const [showAllComments, setShowAllComments] = useState(false);

  const handleShowAll = () => {
    setShowAllComments(true);
  };
  const visibleComments = showAllComments
    ? ItemActivity.comment
    : ItemActivity.comment.slice(0, 2);
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
  const handleJoinClick = async (index, activity, isJoin, title,process) => {
    if (isJoin === "Join") {
      setJoinedIndex(null);
      const action = UnJoinAction(activity, userID);
      dispatch(action);
      
    } else {
      setJoinedIndex(index);
      const action = JoinAction(activity, userID, title, process[0]?.location,process[0]?.startDate,process[0]?.endDate);
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

  };
  const handleFollowClick = (index, activity, isFollow, title) => {
    if (isFollow) {
      setFollowIndex(null);
      const action = UnFollowAction(activity, userID);
      dispatch(action);
      
    } else {
      setFollowIndex(index);
      const action = FollowAction(activity, userID);
      dispatch(action);
     
    }
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
  const popupStyle4 = {
    opacity: openpro1 ? 1 : 0,
    visibility: openpro1 ? "visible" : "hidden",
    overflow: openpro1 ? "auto" : "hidden",
  };

  const endDate = moment(ItemActivity.endDate);
  const currentDate = moment();


  return (
    <div className="">
        <div className="main-wraper">
          <div className="user-post">
            <div className="friend-info">
              <figure>
                <img
                  style={{ height: "40px", width: "40px" }}
                  alt
                  src={
                    fanpageId?.avatar === "none"
                      ? "./../images/giphy-sample.gif"
                      : fanpageId?.avatar
                  }
                />
              </figure>
              <div className="friend-name">
                <div className="more">
                  <div className="more-post-optns">
                    <i className>
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
                        className="feather feather-more-horizontal"
                      >
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={19} cy={12} r={1} />
                        <circle cx={5} cy={12} r={1} />
                      </svg>
                    </i>
                    <ul>
                    {userID === ItemActivity.userId &&
                    endDate.isBefore(currentDate) === false ? (
                      <li
                        onClick={() => {
                          handleClickActiReject();
                  setActiRejectid( ItemActivity.activityId)
                        }}
                      >
                        <i className="icofont-sign-out" />
                       Tắt chiến dịch
                        <span>Ngừng chiến ngay lập tức</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                      {/* {userID === ItemActivity.userId &&
                      endDate.isBefore(currentDate) === false &&
                      ItemActivity.targetDonation === 0 ? (
                        <li
                          onClick={() => {
                            handleClick6();
                            const action = GetActivityByIDAction(
                              ItemActivity.activityId
                            );
                            dispatch(action);
                          }}
                        >
                          <i className="icofont-pen-alt-1" />
                          Sửa bài đăng
                          <span>Chỉnh sửa và cập nhật chi tiết bài đăng</span>
                        </li>
                      ) : (
                        <div></div>
                      )} */}

                      {/* {userID === ItemActivity.userId &&
                      ItemActivity.targetDonation === 0 ? (
                        <li
                          onClick={() => {
                            Swal.fire({
                              title: "Bạn muốn xóa?",
                              text: "Bạn có chắc muốn xóa bài viết này!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Xóa!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                Swal.fire(
                                  "Xóa thành công!",
                                  "Xóa thành công chiến dịch.",
                                  "success"
                                );
                                const action = DeleteActivityByUserAction(
                                  ItemActivity.activityId
                                );
                                dispatch(action);
                              }
                            });
                          }}
                        >
                          <i className="icofont-ui-delete" />
                          Xóa bài đăng
                          <span>
                            Xóa những bài đăng khi bạn cảm thấy có vấn đề không
                            ổn
                          </span>
                        </li>
                      ) : (
                        <div></div>
                      )} */}
                       {userID === ItemActivity.userId &&
                    endDate.isBefore(currentDate) === false ? (
                      <li
                        onClick={() => {
                          handleClickActiReject();
                  setActiRejectid( ItemActivity.activityId)
                        }}
                      >
                        <i className="icofont-sign-out" />
                       Tắt chiến dịch
                        <span>Ngừng chiến ngay lập tức</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                      {userID !== ItemActivity.userId ? (
                        <li
                          onClick={() => {
                            setReportID(ItemActivity.activityId);
                            setReport(true);
                          }}
                        >
                          <i className="icofont-flag" />
                          Báo cáo bài đăng
                          <span>
                            Nhầm báo cáo những vấn đề bất thường đến cho người
                            quản lý
                          </span>
                        </li>
                      ) : (
                        <div></div>
                      )}
                       {endDate.isBefore(currentDate) === true &&
                    userID === ItemActivity.userId ? (
                      <li
                        onClick={() => {
                          handleClickCreate();
                          setIDActivity(ItemActivity.activityId);
                        }}
                      >
                        <i className="icofont-pen-alt-1" />
                        Kết quả chiến dịch
                        <span>Thêm kết quả của chiến dịch</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    {endDate.isAfter(currentDate) === true &&userID === ItemActivity.userId &&
                    ItemActivity?.process?.filter(
                      (item) => item.processTypeId === "pt003"
                    ).length > 0 ? (
                      <li
                        onClick={() => {
                          // handleClickCreate();
                          // setIDActivity(ItemActivity.activityId);
                          const action = GetQRActivityAction(
                            ItemActivity.activityId
                          );
                          dispatch(action);
                        }}
                      >
                        <i className="icofont-qr-code" />
                        Mã QR
                        <span>Lấy mã QR của chiến dịch</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    {endDate.isAfter(currentDate) === true &&
                    userID === ItemActivity?.userId &&
                    ItemActivity?.donation?.length > 0 ? (
                      <li
                        onClick={() => {
                          handleClickDonate();
                          setIsListDonate(ItemActivity?.donation);
                        }}
                      >
                        <i className="icofont-money-bag" />
                        Danh sách donate
                        <span>Danh sách đã donate cho chiến dịch</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    {endDate.isAfter(currentDate) === true &&
                    userID === ItemActivity.userId &&
                    ItemActivity?.followJoinAvtivity?.length > 0 ? (
                      <li
                        onClick={() => {
                          handleClickFolowJoin();
                          setFolowJoin(
                            ItemActivity?.followJoinAvtivity?.filter(
                              (item) => item.isFollow === true
                            )
                          );
                          setJoinFollow(
                            ItemActivity?.followJoinAvtivity?.filter(
                              (item) => item.isJoin === "Join"
                            )
                          );
                        }}
                      >
                        <i className="icofont-people" />
                        Danh sách theo dõi, tham gia
                        <span> Danh sách theo dõi tham gia chiến dịch</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    {endDate.isBefore(currentDate) === true ? (
                      <li
                        onClick={() => {
                          handleClick1();
                          setIDActivity(ItemActivity.activityId);
                          const action1 = GetListEndActivityIDAction(
                            ItemActivity.activityId
                          );
                          dispatch(action1);
                          const action = GetActivityByIDAction(
                            ItemActivity.activityId
                          );
                          dispatch(action);
                        }}
                      >
                        <i className="icofont-eye-open" />
                        Xem kết quả chiến dịch
                        <span>Xem kết quả diễn ra trong chiến dịch</span>
                      </li>
                    ) : (
                      <div></div>
                    )}
                    </ul>
                  </div>
                </div>
                <ins>
                  <h5 className="name-user" style={{ color: "#088dcd" }}>
                    {fanpageId?.fanpageName}
                    <em>
                      <svg
                        style={{ verticalAlign: "middle" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#7fba00"
                          stroke="#7fba00"
                          d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
                        ></path>
                      </svg>
                    </em>
                  </h5>
                </ins>
                <span>
                  {" "}
                  {DateTime(ItemActivity.createAt)}{" "}
                  <i className="icofont-globe" />
                </span>
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
                    <h3
                      style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        width: "450px",
                        wordWrap: "break-word",
                        color: "#088dcd",
                      }}
                      className="col-lg-12"
                    >
                      {ItemActivity.title}
                    </h3>
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
                <figure style={{}}>
                  <div className="image-gallery-flex">
                    {ItemActivity?.media?.length <= 3
                      ? ItemActivity.media.map((image, index) => {
                          return (
                            <div key={index} className={`image-container-post`}>
                              <NavLink
                                to={`/detailactivity/${ItemActivity.activityId}`}
                                onClick={() => {

                                  const action = GetActivityIDAction(
                                    ItemActivity.activityId
                                  );
                                  dispatch(action);
                                }}
                              >
                                <img
                                  src={image.linkMedia}
                                  alt={`Image ${image.id}`}
                                />
                              </NavLink>
                            </div>
                          );
                        })
                      : ItemActivity.media?.slice(0, 4).map((image, index) => {
                          return index !== 3 ? (
                            <div key={index} className={`image-container-post`}>
                              <div
                                href="images/resources/album1.jpg"
                                onClick={() => {
                                  const action = GetActivityIDAction(
                                    ItemActivity.activityId
                                  );
                                  dispatch(action);
                                  history.push(
                                    `/detailactivity/${ItemActivity.activityId}`
                                  );
                                }}
                              >
                                <img
                                  src={image.linkMedia}
                                  alt={`Image ${image.id}`}
                                />
                              </div>
                            </div>
                          ) : (
                            <div
                              key={index}
                              className={`image-container-post-last`}
                            >
                              <a
                                data-toggle="modal"
                                data-target="#img-comt"
                                href="images/resources/album1.jpg"
                                onClick={() => {
                                  setDetail(detailItem);
                                }}
                              >
                                <div className="overlay">
                                  +{ItemActivity.media.length - 4}
                                </div>
                                <img
                                  src={image.linkMedia}
                                  alt={`Image ${image.id}`}
                                />
                              </a>
                            </div>
                          );
                        })}
                  </div>
                </figure>

                {ItemActivity.process?.map((pro, index) => {

                if (
                  moment(pro.startDate, "YYYY-MM-DD").isBefore(currentDate) &&
                  moment(pro.endDate, "YYYY-MM-DD").isAfter(currentDate)
                ) {
                  if (pro.isDonateProcess === true) {
                    return <div style={{ position: "relative" }} >
                      {pro.isDonateProcess === true ? (
                      <div className="mb-4 mt-4 name-user">
                        <p
                          style={{
                            fontWeight: "400",
                            fontSize: "15px",
                          }}
                        >
                          Đã quyên góp được <br />
                          <span
                            style={{                            
                              fontSize: "15px",
                            }}
                          >
                            <span style={{ fontSize: "15px" }}>
                              {pro.realDonation.toLocaleString()}
                            </span>{" "}
                            đ /
                            <span
                              style={{
                               
                                fontSize: "15px",
                              }}
                            >
                              {pro.targetDonation.toLocaleString()} đ
                            </span>{" "}
                          </span>
                        </p>

                        <input
                          type="range"
                          min="0"
                          max={pro.targetDonation}
                          value={pro.realDonation}
                          // onChange={handleChange}
                          className="range-slider"
                          style={{
                            background: `linear-gradient(to right,  #4287f5 0%, #4287f5  ${
                              (pro.realDonation /
                                pro.targetDonation) *
                              100
                            }%, #ddd ${
                              (pro.realDonation /
                                pro.targetDonation) *
                              100
                            }%, #ddd 100%)`,
                            width: "92%",
                          }}
                        />
                        {pro.realDonation === 0 ? (
                              <div
                              className="range-value"
                              style={{
                                position: "absolute",
                                top: "55px",
                                right: "-2px",
                              }}
                            >
                              {
                                (
                                  (pro.realDonation / pro.targetDonation) *
                                  100
                                )
                                  .toString()
                                  .split(".")[0]
                              }
                              %
                            </div>
                            ) : (
                              <div style={{ position: "relative" }}>
                                <div
                                  className="range-value"
                                  style={{
                                    position: "absolute",
                                    top: "-30px",
                                    right: "-2px",
                                  }}
                                >
                                  {((pro.realDonation / pro.targetDonation) *
                                    100).toFixed(0)}
                                  %
                                </div>
                              </div>
                            )}
                          </div>
                  )
                   : (
                      <div></div>
                    )
                   }</div>
                  }
                }
              })}
              {endDate.isBefore(currentDate) ? (
                <div></div>
              ) : (
                <div>
                  {ItemActivity.process?.map((pro, index) => {
                    if (
                      moment(pro.startDate, "YYYY-MM-DD").isBefore(
                        currentDate
                      ) &&
                      moment(pro.endDate, "YYYY-MM-DD").isAfter(currentDate)
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
                    paddingTop: "20px",
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
                   {endDate.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <div>
                    {ItemActivity.process?.map((pro, index) => {
                      if (
                        moment(pro.startDate, "YYYY-MM-DD").isBefore(
                          currentDate
                        ) &&
                        moment(pro.endDate, "YYYY-MM-DD").isAfter(currentDate)
                      ) {
                        if (pro.isParticipant === true) {
                          return (
                            <button
                              className={` ${
                                isAlreadyJoined === "Join" ? "btn-change" : "btn-color"
                              } mb-4 mt-4 btn-add ${
                                ItemActivity.targetDonation !== 0
                                  ? "marginfollow"
                                  : "sas"
                              }`}
                              onClick={() => {
                                handleJoinClick(
                                  index,
                                  ItemActivity.activityId,
                                  isAlreadyJoined,
                                  ItemActivity.title,
                                  ItemActivity?.process?.filter(
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

                {(ItemActivity?.process?.length === 0) || endDate.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <button
                    className={` ${
                      isAlreadyFollowed ? "btn-change" : "btn-color"
                    } mb-4 mt-4`}
                    onClick={() => {
                      handleFollowClick(
                        index,
                        ItemActivity.activityId,
                        isAlreadyFollowed,
                        ItemActivity.title
                      );
                    }}
                  >
                    {
                      //TODO
                    }
                    {isAlreadyFollowed ? "Hủy theo dõi" : "Theo dõi"}
                  </button>
                )}
                {endDate.isBefore(currentDate) ? (
                  <div></div>
                ) : (
                  <div>
                    {ItemActivity.process?.map((pro, index) => {

                      if (
                        moment(pro.startDate, "YYYY-MM-DD").isBefore(
                          currentDate
                        ) &&
                        moment(pro.endDate, "YYYY-MM-DD").isAfter(currentDate)
                      ) {
                        if (pro.isDonateProcess === true) {
                          return (
                            <button
                              className=" btn-color btn-donate"
                              onClick={() => {
                                // setActi(ItemActivity.activityId)
                                setDonate(
                                  ItemActivity.activityId
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
                  {ItemActivity.process.length !== 0 ? (
                    <NavLink
                      to={`/detailprocess/${ItemActivity.activityId}`}
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
                                return <li>{userItem.user?.username}</li>;
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
                          color: "blue",
                          fontSize: "15px",
                        }}
                      >
                        <span>
                          {(ItemActivity.comment
                            ? ItemActivity.comment.length
                            : 0) +
                            (ItemActivity.comment.inverseReply
                              ? ItemActivity.comment?.inverseReply?.length
                              : 0)}{" "}
                          bình luận
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
                  <div
                    className="share"
                    onClick={() => {
                      const textToCopy = `https://svcw-studentsvolunteer.vercel.app/detailactivity/${ItemActivity.activityId}`;
  
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
                          <div
                            style={{ marginLeft: "10px" }}
                            className="textcmt"
                          >
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
        <UpdateActivity
          openpro1={openpro1}
          popupStyle4={popupStyle4}
          handleClick6={handleClick6}
        />
        <ReportActivity
          report={report}
          reportid={reportid}
          popupStyle3={popupStyle3}
          handleClick={handleClick}
          arrReportType={arrReportType}
        />
         <ResultActivity
        popupStyle1={popupStyle1}
        handleClick1={handleClick1}
        isOpen1={isOpen1}
        idActivity={idActivity}
      />
        <ShareActivity
          share={share}
          handleClickShare={handleClickShare}
          popupStyleShare={popupStyleShare}
          activityId={shareActivityID}
        />
       <Donate isPopupOpen = {isPopupOpen}  openPopup={openPopup} donate={donate} />
       <RejectActivi actireject={actireject} popupStyleActiReject={popupStyleActiReject} handleClickActiReject={handleClickActiReject} actirejectid={actirejectid}/>
    </div>
  );
}
