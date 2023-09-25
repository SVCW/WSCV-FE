import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetFanpageByIDAction } from "../../redux/actions/FanpageAction";
import ListActivity from "../../components/ListActivity";
import ListEndActivity from "../../components/ListEndActivity";
import ListActivityFanpage from "./ListActivityFanpage";
import Clock from "../../components/Clock";
import CompleteInfo from "../../components/CompleteInfo";
import UpdateFanpage from "./UpdateFanpage";

export default function DetailFanpage(props) {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const { fanpageId } = useSelector((root) => root.FanpageReducer);
  const { userID } = useSelector((root) => root.LoginReducer);
  const [update, setUpdate] = useState(false);
  const handleClickUpdate = () => {
    setUpdate((prevIsOpen) => !prevIsOpen);
    const action = GetFanpageByIDAction(id);
    dispatch(action)
  };
  const popupStyleUpdate = {
    opacity: update ? 1 : 0,
    visibility: update ? "visible" : "hidden",
    overflow: update ? "auto" : "hidden",
  };
  useEffect(() => {
    const action = GetFanpageByIDAction(id);
    dispatch(action);
  }, []);
  return (
    <Fragment>
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
                      {fanpageId?.coverImage ==='none' ? <img src="./../images/bg-4.png" alt /> :<img src={fanpageId?.coverImage} alt />}
                        {/* {localStorage.getItem('userID') === fanpageId.fanpageId ? <div></div> : <a href="#" title><i className="icofont-check-circled" />Theo dõi</a>} */}
                        <figure className="group-dp">
                        {fanpageId?.avatar ==='none' ? <img src="./../images/giphy-sample.gif" alt /> :<img src={fanpageId?.avatar} alt />}
                        </figure>
                      </div>
                      <div className="grp-info">
                        <h4>
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
                          <span>@Cộng đồng</span>
                        </h4>
                        <ul>
                          <li>
                            <span>Ngày tạo: </span>
                            {moment(fanpageId?.createAt).format("DD/MM/YYYY")}
                          </li>
                          <li>
                            <span>Số điện thoại: </span> {fanpageId?.phone}
                          </li>
                          <li>
                            <span>Bài viết: </span>{" "}
                            {fanpageId?.activity?.length}
                          </li>
                          <li>
                            <span>Lượt theo dõi:</span>
                            {fanpageId?.numberFollow}
                          </li>
                        </ul>
                        
                        <ul className="more-grp-info">
                          <li>
                            <form className="c-form" method="post">
                              <input type="text" placeholder="Tìm Kiếm" />
                              <i className="icofont-search-1" />
                            </form>
                          </li>
                          <li>
                            {fanpageId?.fanpageId === userID ? (
                              <div className="more">
                                <div className="more-post-optns">
                                  <i className>
                                    <svg
                                      className="feather feather-more-horizontal"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      height={24}
                                      width={24}
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle r={1} cy={12} cx={12} />
                                      <circle r={1} cy={12} cx={19} />
                                      <circle r={1} cy={12} cx={5} />
                                    </svg>
                                  </i>
                                  <ul>
                                    <li onClick={() =>{setUpdate(true)}}>
                                      <i className="icofont-pen-alt-1" />
                                      Chỉnh sửa
                                      <span>
                                        Chỉnh sửa thông tin fanpage của bạn
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </li>
                          
                          
                       
                        </ul>
                        <div className="main-wraper mt-4">
                            <div className="grp-about">
                              <div className="row">
                                <div className="col-lg-8 col-md-6">
                                  <h4>Chi tiết</h4>
                                  <ul className="badges">
                                  {fanpageId?.description}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                      <ListActivityFanpage
                        arrActivity={fanpageId?.activity}
                        fanpageId={fanpageId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>   
      <UpdateFanpage 
        update={update}
        handleClickUpdate={handleClickUpdate}
        popupStyleUpdate={popupStyleUpdate}
        fanpageId={fanpageId} />
    </Fragment>
  );
}
