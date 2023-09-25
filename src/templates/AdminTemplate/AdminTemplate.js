import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, NavLink } from "react-router-dom";
import { history } from "../../App";

export const AdminTemplate = (props) => {
  const dispatch = useDispatch();
  const { admin } = useSelector((root) => root.UserReducer);
  const { moderator } = useSelector((root) => root.LoginReducer);
  console.log(moderator);
  const { Component, ...restProps } = props;

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const popupStyle = {
    opacity: isDropdownVisible ? 1 : 0,
    visibility: isDropdownVisible ? "visible" : "hidden",
    overflow: isDropdownVisible ? "auto" : "hidden",
  };

  const handleDropdownClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <Route
      {...restProps}
      render={(propsRoute) => {
        if (localStorage.getItem("admin") !== "no") {
          return (
            <Fragment>
              <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
                <div className="app-header header-shadow  ">
                  <div
                    className="app-header__logo"
                    style={{ marginRight: "10px" }}
                  >
                    <div class="logo">
                      <img src="/images/logo.png" />
                      <span>SVCW</span>
                    </div>
                    {/* <div className="logo-abc" /> */}
                    <div className="header__pane ml-auto">
                      <div>
                        <button
                          type="button"
                          className="hamburger close-sidebar-btn hamburger--elastic"
                          data-class="closed-sidebar"
                        >
                          <span className="hamburger-box">
                            <span className="hamburger-inner" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="app-header__menu">
                    <span>
                      <button
                        type="button"
                        className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
                      >
                        <span className="btn-icon-wrapper">
                          <i className="fa fa-ellipsis-v fa-w-6" />
                        </span>
                      </button>
                    </span>
                  </div>
                  <div className="app-header__content">
                    <div className="app-header-left">
                      <div className="search-wrapper"></div>
                    </div>
                    <div className="app-header-right">
                      <div className="header-btn-lg pr-0">
                        <div className="widget-content p-0">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left"></div>

                            <div
                              className="widget-content-right header-user-info ml-3"
                              style={{ display: "flex" }}
                            >
                              <h6
                                style={{
                                  marginRight: "30px",
                                  marginTop: "9px",
                                }}
                              >
                                Xin chào! {localStorage.getItem("admin")}{" "}
                              </h6>
                              <div
                                className="btn-shadow p-1 btn  btn-sm  btn btn-secondary dropdown-toggle" style={{background:'#3f6ad8'}}
                                onClick={() => {
                                  handleDropdownClick();
                                }}
                              >
                                <i className="fa text-white fa-calendar pr-1 pl-1" />
                              </div>
                              {isDropdownVisible ? (
                                <div
                                  tabIndex={-1}
                                  role="menu"
                                  aria-hidden="true"
                                  className="dropdown-menu dropdown-menu-right show"
                                  style={popupStyle}
                                >
                                  {localStorage.getItem("admin") ===
                                  "moderator" ? (
                                    <div
                                      style={{
                                        marginBottom: "20px",
                                        paddingLeft: "10px",
                                        fontSize: "15px",
                                      }}
                                    >
                                      <NavLink
                                        style={{ color: "#3f6ad8" }}
                                        type="button"
                                        to={`/profilemoderator/${moderator.userId}`}
                                        tabIndex={0}
                                        className=""
                                        onClick={() => {
                                          handleDropdownClick();
                                        }}
                                      >
                                        Trang cá nhân
                                      </NavLink>
                                    </div>
                                  ) : (
                                    <div></div>
                                  )}
                                  <NavLink
                                    style={{
                                      color: "#3f6ad8",
                                      paddingLeft: "10px",
                                      fontSize: "15px",
                                    }}
                                    type="button"
                                    to="/"
                                    tabIndex={0}
                                    className=""
                                    onClick={() => {
                                      const action = {
                                        type: "LOGOUT_ADMIN",
                                        admin: localStorage.setItem(
                                          "admin",
                                          "no"
                                        ),
                                      };
                                      dispatch(action);
                                    }}
                                  >
                                    Đăng xuất
                                  </NavLink>
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-main">
                  <div className="app-sidebar sidebar-shadow">
                    <div className="scrollbar-sidebar roll-header">
                      <div className="app-sidebar__inner">
                        <ul className="vertical-nav-menu">
                          <li className="app-sidebar__heading">Thống kê</li>
                          <li>
                            <NavLink to="/adminstatistical">
                              <i className="metismenu-icon pe-7s-graph2"></i>
                              Thống kê
                            </NavLink>
                          </li>
                          {localStorage.getItem("admin") !== "admin" ? (
                            <Fragment></Fragment>
                          ) : (
                            <Fragment>
                              <li className="app-sidebar__heading">Huy hiệu</li>
                              <li>
                                <NavLink to="/achivement">
                                  <i className="metismenu-icon pe-7s-display2" />
                                  Huy hiệu
                                </NavLink>
                              </li>
                            </Fragment>
                          )}
                          {localStorage.getItem("admin") !== "admin" ? (
                            <Fragment></Fragment>
                          ) : (
                            <Fragment>
                              <li className="app-sidebar__heading">
                                Hoạt động
                              </li>
                              <li>
                                <NavLink to="/processtype">
                                  <i className="metismenu-icon pe-7s-mouse"></i>
                                  Loại hoạt động
                                </NavLink>
                              </li>
                            </Fragment>
                          )}
                          {localStorage.getItem("admin") !== "admin" ? (
                            <Fragment></Fragment>
                          ) : (
                            <Fragment>
                              <li className="app-sidebar__heading">Báo cáo</li>
                              <li>
                                <NavLink to="/reporttype">
                                  <i className="metismenu-icon pe-7s-attention"></i>
                                  Loại báo cáo
                                </NavLink>
                                <NavLink to="/report">
                                  <i className="metismenu-icon pe-7s-close-circle"></i>
                                  Báo cáo
                                </NavLink>
                              </li>
                            </Fragment>
                          )}

                          {/* <li className="app-sidebar__heading">Vai trò</li>
                          <li>
                            <NavLink to="/role">
                              <i className="metismenu-icon pe-7s-users"></i>Vai
                              trò
                            </NavLink>
                          </li> */}
                          {localStorage.getItem("admin") === "admin" ? (
                            <Fragment>
                              <li className="app-sidebar__heading">
                                Người kiểm duyệt
                              </li>
                              <li>
                                <NavLink to="/moderator">
                                  <i className="metismenu-icon pe-7s-id"></i>
                                  Người kiểm duyệt
                                </NavLink>
                              </li>
                            </Fragment>
                          ) : (
                            <Fragment></Fragment>
                          )}
                          <li className="app-sidebar__heading">Tổ chức</li>
                          <li>
                            <NavLink to="/adminfanpage">
                              <i className="metismenu-icon pe-7s-global"></i>Tổ
                              chức
                            </NavLink>
                          </li>

                          <li className="app-sidebar__heading">Chiến dịch</li>
                          <li>
                            <NavLink to="/adminactivity">
                              <i className="metismenu-icon pe-7s-browser"></i>
                              Chiến dịch
                            </NavLink>
                          </li>
                          <li className="app-sidebar__heading">
                            Tình nguyện viên
                          </li>
                          <li>
                            <NavLink to="/volunteer">
                              <i className="metismenu-icon pe-7s-user"></i>Tình
                              nguyện viên
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Component {...propsRoute} />
                </div>
              </div>
            </Fragment>
          );
        }
        alert("Bạn không đủ quyền truy cập");
        history.push("/");
        window.location.reload();
      }}
    />
  );
};
