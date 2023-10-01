import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { GetProfileByIdAction } from "../../../redux/actions/ProfileAction";
import {
  GetActivityTitleAction,
  GetListActivityAction,
  RecommentActivityAction,
  markNotificationAsRead,
} from "../../../redux/actions/ActivityAction";
import { async } from "q";
import { history } from "../../../App";
import { GetNotiUserAction } from "../../../redux/actions/UserAction";
import moment from "moment";
import { array } from "yup";
import Swal from "sweetalert2";

export default function Header(props) {
  const { userID } = useSelector((root) => root.LoginReducer);
  const { arrNoti } = useSelector((root) => root.UserReducer);
  console.log(arrNoti);

  const [noti, setNoti] = useState(arrNoti);
  const [thongBao, setThongBao] = useState(false);
  const handleClick = () => {
    setThongBao((tb) => !tb);
  };
  const [showAllComments, setShowAllComments] = useState(false);
  const [openSideSlide, setOpenSideSlide] = useState(false);


  const handleShowAll = () => {
    setShowAllComments(true);
  };

  const [lastArray, setLastArray] = useState([]);

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

  // Toast.fire({
  //   icon: "error",
  //   title: `Bỏ theo dõi chiến dịch ${title} thành công `,
  // });

  // useEffect(() => {
  //   const differenceArray = arrNoti.filter(item1 => {
  //     return !lastArray.some(item2 => item2.notificationId === item1.notificationId);
  //   });

  //   if (differenceArray instanceof Array && differenceArray.length > 0 && lastArray.length > 0) {
  //     differenceArray.forEach((noti) => {
  //       Toast.fire({
  //         icon: "info",
  //         title: `${noti?.title}`,
  //       });
  //     });

  //   }

  //   console.log('diff Array: ', differenceArray);
  //   console.log('lastArray: ', lastArray);
  //   console.log('diff arrNoti: ', arrNoti);
  //   setLastArray(arrNoti)
  // }, [arrNoti]);




  const visibleComments = showAllComments
    ? arrNoti
    : arrNoti.slice(0, 4);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const { getUserId, arrActivityUser } = useSelector(
    (root) => root.ProfileReducer
  );
  const toggleDarkMode = () => {
    document.body.classList.toggle("nightview");
  };

  useEffect(() => {
    const fetchData = async () => {
      const action = GetProfileByIdAction(userID);
      await dispatch(action);

      // Gọi hàm sau 2 giây
      const intervalId = setInterval(() => {
        yourFunction();
      }, 10000);

      // Xóa interval khi component unmount hoặc khi không còn cần thiết
      return () => clearInterval(intervalId);

    };

    fetchData();
  }, [userID, dispatch]);
  const yourFunction = () => {
    const action1 = GetNotiUserAction(userID);
    dispatch(action1);

  };

  const DateTime = (item) => {
    const currentTime = moment();
    const inputTime = moment(item);
    const duration = moment.duration(currentTime.diff(inputTime));
    const hoursAgo = duration.asHours();
    let timeAgoString = "";
    if (hoursAgo < 1) {
      const daysAgo = Math.floor(duration.asMinutes());
      timeAgoString = `${daysAgo} Phút Trước`;
    } else if (hoursAgo >= 24) {
      const daysAgo = Math.floor(duration.asDays());
      timeAgoString = `${daysAgo} ngày trước`;
    } else if (hoursAgo > 48) {
      const formattedDate = inputTime.format("DD/MM/YYYY HH:mm:ss");
      timeAgoString = formattedDate;
    } else {
      const hoursAgo = Math.floor(duration.asHours());
      timeAgoString = `${hoursAgo} giờ trước`;
    }
  };

  const formik = useFormik({
    initialValues: {
      search: "",
    },

    onSubmit: async (value) => {
      console.log(formik.values.search);
      if (formik.values.search !== "") {
        props.history.push(`/search/${formik.values.search}`);
        // const action = await GetActivityTitleAction(value, props);
        // dispatch(action);
      } else {
        const action = await GetListActivityAction();
        dispatch(action);
        localStorage.setItem("find", "");
      }
    },
  });

  return (
    <>
      <header className>
        <div className="topbar stick" style={{ position: "relative" }}>
          <NavLink to="/home" className="logo">
            <img src="../images/logo.png" alt />
            <span>SVCW</span>
          </NavLink>

          <div className="searches">
            <form method="post" onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                name="search"
                onChange={formik.handleChange}
              />
              <button type="submit">
                <i className="icofont-search" />
              </button>
              <span className="cancel-search">
                <i className="icofont-close" />
              </span>
              <div className="recent-search">
                <h4 className="recent-searches">Gần Đây</h4>
                <ul className="so-history">
                  <li>
                    <div className="searched-user">
                      <figure>
                        <img
                          style={{ height: "2.5rem", width: "2.5rem" }}
                          src={getUserId?.image}
                          alt
                        />
                      </figure>
                      <span className="long-text">Miền Trung</span>
                    </div>
                    <span className="trash">
                      <i className="icofont-close-circled" />
                    </span>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          {/* Search box left */}

          <ul className="web-elements" style={{ width: 400 }}>
            <li>
              <div className="user-dp">
                <NavLink to={`/profile/${localStorage.getItem("userID")}`} title>
                  <img
                    alt=""
                    sizes=""
                    src={
                      getUserId?.image === "none"
                        ? "../images/avatar.jpg"
                        : getUserId?.image
                    }
                  />
                  <div className="name">
                    <h4>{localStorage.getItem("username")}</h4>
                  </div>
                </NavLink>
              </div>
            </li>

            <li>
              <NavLink to="/home" title="Trang Chủ" data-toggle="tooltip">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </i>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="mesg-notif"
                to="/message/default"
                title="Tin Nhắn"
                data-toggle="tooltip"
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-message-square"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>
              </NavLink>
              <span />
            </li>
            <li
              onClick={() => {
                // handleClick();
                setOpenSideSlide(!openSideSlide)
              }}
            >
              <a
                className="mesg-notif"
                href="#"
                title="Thông Báo"
                data-toggle="tooltip"
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-bell"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </i>
              </a>
              <span />
            </li>



            <li className="test">
              <a href="#" className="create">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-grid"
                  >
                    <rect x={3} y={3} width={7} height={7} />
                    <rect x={14} y={3} width={7} height={7} />
                    <rect x={14} y={14} width={7} height={7} />
                    <rect x={3} y={14} width={7} height={7} />
                  </svg>
                </i>
              </a>

              <ul className="dropdown">
                {localStorage.getItem("userID") ? (
                  <li>
                    <NavLink
                      to={`/profile/${localStorage.getItem("userID")}`}
                      title
                    >
                      <i className="icofont-user-alt-3" /> Trang cá nhân
                    </NavLink>
                  </li>
                ) : (
                  <Fragment></Fragment>
                )}

                <li>
                  <NavLink to="/history" title>
                    <i className="icofont-flash" /> Lịch sử
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/statisticaluser" title>
                    <i className="fa-solid fa-chart-simple" /> Thống kê
                  </NavLink>
                </li>
                {getUserId?.fanpage === null ? (
                  <li>
                    <NavLink to="/createfanpage" title>
                      <i className="icofont-plus" /> Tạo tổ chức
                    </NavLink>
                  </li>
                ) : (
                  <Fragment></Fragment>
                )}

                <li>
                  <a className="dark-mod" href="#" onClick={toggleDarkMode}>
                    <i className="icofont-moon" /> Sáng/Tối
                  </a>
                </li>
                <li
                  className="logout"
                  onClick={() => {
                    const action = {
                      type: "LOGOUT",
                    };
                    dispatch(action);
                    const action1 = {
                      type: "LOGOUT1",
                    };
                    dispatch(action1);
                  }}
                >
                  <NavLink to="/" title>
                    <i className="icofont-power" />{" "}
                    {localStorage.getItem("userID") ? "Đăng xuất" : "Đăng nhập"}
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Drop box header */}
          </ul>
          {/* Function buttons right */}
        </div>

        {thongBao ? (
          <div style={{ position: "absolute", right: "150px", top: "100px" }}>
            <div
              className="search-result-1"
              style={{ display: "flex", width: "300px" }}
            >
              <div style={{ width: "15%" }}>
                {/* <div>
                        {item.image?.length === 0 ? (
                          <img src="../images/avatar.jpg" />
                        ) : (
                          <img src={item.media?.[0]?.linkMedia} />
                        )} */}
                {/* </div> */}
              </div>
              <div style={{ width: "95%", marginLeft: "20px" }}>
                {visibleComments?.map((item, index) => {
                  return (
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 700 }}>
                        <NavLink
                          to={item.activityId ? `/profile/${localStorage.getItem('userID')}` : `/detailactivity/${item?.activity?.activityId}`}                        >
                          {item.title}
                        </NavLink>
                      </div>
                      <div style={{ fontSize: "18px" }}>
                        {moment(item.datetime).format("DD/MM/YYYY hh:mm A")}
                      </div>
                      <p> {DateTime(item.datetime)}</p>
                      <hr />
                    </div>
                  );
                })}
                {arrNoti.length > 2 && !showAllComments && (
                  <div
                    onClick={handleShowAll}
                    className=""
                    style={{ color: "rgb(8, 141, 205)", cursor: "pointer" }}
                  >
                    Xem thêm...
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </header>

      {/* noti side slide */}
      <div style={{
        position: 'absolute',
        top: '107px',
        height: 'auto',
        padding: '10px',
        transition: 'all 0.55s linear 0s',
        display: openSideSlide ? 'inline-block' : 'none',
      }} className={openSideSlide ? "side-slide active" : "side-slide"}>
        <span className="popup-closed" onClick={() => setOpenSideSlide(!openSideSlide)}><i className="icofont-close" /></span>
        <div className="slide-meta">
          <div className="tab-content">
            <div className="tab-pane active show fade" id="notifications">
              <h4><i className="icofont-bell-alt" /> Thông báo</h4>
              <ul className="notificationz" style={{
                paddingTop: '0px',
                marginBottom: '5px'
              }}>
                {visibleComments?.map((item, index) => {
                  return (
                    <NavLink
                      to={item?.activityId === null ? `/profile/${localStorage.getItem('userID')}` : `/detailactivity/${item?.activity?.activityId}`}
                    >
                      <>
                        <li style={{
                          background: item?.status ? '#d6eefe' : '',
                          padding: '10px',
                          display: 'flex',
                          borderRadius: '4px',
                          marginBottom: '5px'
                        }}
                          onClick={() => markNotificationAsRead(item?.notificationId)}
                        >
                          <figure>
                            <i style={{
                              marginTop: '1rem',
                            }} className="icofont-bell-alt" />
                          </figure>
                          <div className="mesg-info" >
                            <span>{item.title}</span>
                            {/* <a href="#" title>recommend your post</a> */}
                          </div>
                        </li>
                      </>

                    </NavLink>
                  )
                })
                }

              </ul>
              {visibleComments?.length > 3 ? (
                <a
                  style={{
                    borderRadius: '4px'
                  }}
                  onClick={() => setShowAllComments(!showAllComments)}
                  title className="main-btn"
                  data-ripple>{showAllComments ? 'Thu gọn' : 'Xem tất cả'}
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div >
      </div >
    </>

  );
}
