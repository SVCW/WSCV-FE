import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Clock from "../../components/Clock";
import { useDispatch, useSelector } from "react-redux";
import { GetProfileByIdAction } from "../../redux/actions/ProfileAction";
import moment from "moment";
import CreateActivity from "../../components/CreateActivity";
import ListActivity from "../../components/ListActivity";
import Albums from "./Albums";
import PersonalDetail from "./PersonalDetail";
import EndActivity from "./EndActivity";
import {
  GetListEndActivityAction,
  GetListEndActivityByUserIDAction,
} from "../../redux/actions/ActivityAction";
import CompleteInfo from "../../components/CompleteInfo";
import SuggestedGroup from "../../components/SuggestedGroup";
import Other from "../../components/Other";
import {
  GetListReportAction,
  GetListReportByTypeAction,
} from "../../redux/actions/ReportAction";
import { GetListReportTypeAction } from "../../redux/actions/ReportTypeAction";
import YourFanpage from "../../components/YourFanpage";
import Loading from "../../components/Loading";
import StopActivity from "../StopActivity/StopActivity";

export default function Profile(props) {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const { userID } = useSelector((root) => root.LoginReducer);
  const { getUserId } = useSelector((root) => root.ProfileReducer);
  console.log(getUserId);
  const { arrEndActivityByUserID } = useSelector(
    (root) => root.EndActivityReducer
  );
  const [isOpen, setIsOpen] = useState(false);
  const popupStyleCreate = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    overflow: isOpen ? "auto" : "hidden",
  };
  const handleClickCreate = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const { isLoadingM } = useSelector((root) => root.LoadingReducer);
  const [loading, setLoading] = useState(isLoadingM);
  useEffect(() => {
    // const loading = {
    //   type: "DISPLAY_LOADING",
    // };
    // dispatch(loading);
    const action = GetProfileByIdAction(id);
    dispatch(action);
    const action1 = GetListEndActivityByUserIDAction(id);
    dispatch(action1);
    const action4 = GetListReportTypeAction();
    dispatch(action4);
    // const loading1 = {
    //   type: "HIDE_LOADING",
    // };
    // dispatch(loading1);
  }, []);
  return (
    <div>
      {/* {loading ? <Loading /> : <Fragment></Fragment>} */}
      <div className="theme-layout">
        <section>
          <div className="gap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div id="page-contents" className="row merged20">
                    <div className="col-lg-3">
                      <aside className="sidebar static left">
                        <Clock />
                        <CompleteInfo />
                      </aside>
                    </div>
                    <div className="col-lg-9">
                      <div className="group-feed">
                        <div className="group-avatar">
                          {getUserId?.coverImage === "none" ? (
                            <img src="../images/back.jpg" />
                          ) : (
                            <img
                              src={getUserId?.coverImage}
                              style={{ objectFit: "cover" }}
                              alt
                            />
                          )}
                          {getUserId?.userId === userID ? (
                            <div></div>
                          ) : (
                            <div className="follow">
                              <i className="icofont-check-circled" />
                              Thích
                            </div>
                          )}
                          <figure className="group-dp">
                            {" "}
                            {getUserId?.image === "none" ? (
                              <img src="../images/avatar.jpg" />
                            ) : (
                              <img src={getUserId?.image} alt />
                            )}
                          </figure>
                        </div>
                        <div className="grp-info about">
                          <h4>
                            {getUserId?.username}{" "}
                            <span>
                              {getUserId?.fullName !== "none"
                                ? `@${getUserId?.fullName}`
                                : ""}
                            </span>
                          </h4>
                          <ul className="joined-info">
                            {id === userID ? (
                              <li>
                                <span>Ngày tạo tài khoản:</span>{" "}
                                {moment(getUserId?.createAt).format(
                                  "DD/MM/YYYY"
                                )}
                              </li>
                            ) : (
                              <li></li>
                            )}
                            {id === userID ? (
                              <li
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleClickCreate();
                                }}
                              >
                                <span>Số tổ chức đang theo dõi:</span>{" "}
                                {getUserId?.followFanpage?.length}
                              </li>
                            ) : (
                              <li></li>
                            )}
                            <li>
                              <span>Số bài viết:</span>{" "}
                              {getUserId?.activity?.length}
                            </li>
                            {/* <li>
                              <span>Số người thích:</span>{" "}
                            </li> */}
                          </ul>

                          <ul
                            className="nav nav-tabs about-btn"
                            style={{ margin: "20px 0" }}
                          >
                            <li className="nav-item">
                              <a
                                className="active"
                                href="#posts"
                                data-toggle="tab"
                              >
                                Bài viết
                              </a>
                            </li>
                            <li className="nav-item">
                              <a className href="#pictures" data-toggle="tab">
                                Hình ảnh
                              </a>
                            </li>

                            {getUserId?.userId === userID ? (
                              <li className="nav-item">
                                <a className href="#about" data-toggle="tab">
                                  Thông tin cá nhân
                                </a>
                              </li>
                            ) : (
                              <li></li>
                            )}
                            <li className="nav-item">
                              <a
                                className
                                href="#endactivity"
                                data-toggle="tab"
                              >
                                Danh sách kết thúc chiến dịch
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className
                                href="#stopactivity"
                                data-toggle="tab"
                              >
                                Danh sách chiến dịch bị tạm ngưng
                              </a>
                            </li>
                          </ul>
                        </div>
                        {getUserId?.achivementUser?.length !== 0 ? (
                          <div className="main-wraper">
                            <div className="grp-about">
                              <div className="row">
                                <div className="col-lg-8 col-md-6">
                                  <h4>Danh hiệu</h4>
                                  <ul className="badges">
                                    {getUserId?.achivementUser?.map(
                                      (item, index) => {
                                        return (
                                          <li
                                            key={index}
                                            style={{ marginRight: "5px" }}
                                          >
                                            <img
                                              src={
                                                item?.achivement?.achivementLogo
                                              }
                                              alt={`${item?.achivement?.description}`}
                                              title={`${item?.achivement?.description}`}
                                              style={{
                                                width: "50px",
                                                height: "40px",
                                              }}
                                            />
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}

                        <div className="row">
                          <div className="col-lg-12">
                            <div className="tab-content">
                              <div
                                className=" tab-pane active fade show "
                                id="posts"
                              >
                                <div className="row merged20">
                                  <div className="col-lg-8">
                                    <CreateActivity />
                                    {/* create new post */}
                                    <div className="">
                                      <ListActivity
                                        arrActivity={getUserId?.activity}
                                        getUserId={getUserId}
                                      />
                                    </div>
                                  </div>
                                  <Other />
                                </div>
                              </div>

                              <Albums arrActivity={getUserId?.activity} />
                              <div className="tab-pane fade" id="about">
                                <div className="row merged20">
                                  <div className="col-lg-12">
                                    <PersonalDetail
                                      arrActivity={getUserId}
                                      setReloadPage={setReloadPage}
                                      reloadPage={reloadPage}
                                    />
                                  </div>
                                </div>
                              </div>
                              <EndActivity
                                arrEndActivityByUserID={arrEndActivityByUserID}
                                getUserId={getUserId}
                              />
                              <StopActivity
                                arrEndActivityByUserID={getUserId?.activity}
                                getUserId={getUserId}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <figure className="bottom-mockup">
          <img alt src="../images/footer.png" />
        </figure>
        {/* bottombar */}
        <div className="bottombar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <span className>© SVCW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen ? (
        <div className="post-new-popup1" style={popupStyleCreate}>
          <div
            className="popup"
            style={{
              width: 600,
              zIndex: 80,

              // overflowY: "scroll",
              padding: "40px 30px",
              marginTop: "-100px",
            }}
          >
            <span className="popup-closed" onClick={handleClickCreate}>
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
                  Danh sách tổ chức đang theo dõi
                </h5>
              </div>
            </div>
            <div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr'}}>
                {getUserId?.followFanpage?.map((item, index) => {
                  return (
                    <div >
                      <div style={{margin:'0 auto'}}>
                      <img
                        src={item?.fanpage?.avatar}
                       style={{width:'80px', height:'80px' }}
                      />
                      </div>
                      <NavLink to={`/fanpage/${item?.fanpage?.fanpageId}`} style={{fontWeight:800 }}>{item?.fanpage?.fanpageName}</NavLink >
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
