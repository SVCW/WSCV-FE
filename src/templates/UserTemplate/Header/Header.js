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
} from "../../../redux/actions/ActivityAction";
import { async } from "q";
import { history } from "../../../App";

export default function Header(props) {
  const { userID } = useSelector((root) => root.LoginReducer);

  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const { getUserId, arrActivityUser } = useSelector(
    (root) => root.ProfileReducer
  );
  const toggleDarkMode = () => {
    document.body.classList.toggle("nightview");
  };

  useEffect(() => {
    // const action = GetProfileByIdAction(userID);
    // dispatch(action);
  }, [userID]);
  const formik = useFormik({
    initialValues: {
      search: "",
    },

    onSubmit: async (value) => {
      console.log(formik.values.search)
      if (formik.values.search !== "") {
        props.history.push(`/search/${formik.values.search}`)
        // const action = await GetActivityTitleAction(value, props);
        // dispatch(action);
   
      } else {
        const action =await GetListActivityAction();
        dispatch(action);
        localStorage.setItem('find','')
      }
    },
  });

  return (
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
                  alt=''
                  sizes=''
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
            <NavLink
              to="/home"
              title="Trang Chủ"
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
              to="/message"
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
          <li>
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
    </header>
  );
}
