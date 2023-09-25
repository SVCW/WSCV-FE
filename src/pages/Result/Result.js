import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { HistoryFollowJoinAction } from "../../redux/actions/HistoryAction";
import moment from "moment";
import { HistoryDonationAction } from "../../redux/actions/DonationAction";
import { useState } from "react";
import { GetActivityIDAction } from "../../redux/actions/ActivityAction";
export default function Result() {
  const [detail, setDetail] = useState({});
  const { arrFollowJoin } = useSelector((root) => root.HistoryReducer);
  const { arrDonation } = useSelector((root) => root.DonationReducer);
  console.log(arrDonation);
  const { userID } = useSelector((root) => root.LoginReducer);
  const dispatch = useDispatch();
  const [isReadMore, setReadMore] = useState(false);
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

    // Remove periods and convert words after spaces to lowercase
    timeAgoString = timeAgoString
      .replace(/\./g, "")
      .replace(/(?:^|\s)\S/g, (char) => char.toLowerCase());

    return timeAgoString;
  };
  useEffect(() => {
    const action = HistoryFollowJoinAction(userID);
    dispatch(action);
    const action1 = HistoryDonationAction(userID);
    dispatch(action1);
  }, []);

  return (
    <div className="theme-layout">
      <section>
        <div className="top-area bluesh high-opacity">
          <div
            className="bg-image"
            style={{ backgroundImage: "url(images/resources/top-bg.jpg)" }}
          />
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="post-subject">
                  <div className="university-tag">
                    <div className="Search-result">
                      <h4>
                        <strong>Lịch sử</strong>
                      </h4>
                    </div>
                  </div>
                  <ul className="nav nav-tabs post-detail-btn">
                    <li className="nav-item">
                      <a className="active" href="#allposts" data-toggle="tab">
                        Chiến dịch đã tham gia
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className href="#members" data-toggle="tab">
                        Chiến dịch đang theo dõi
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className href="#depart" data-toggle="tab">
                        Số tiền ủng hộ
                      </a>
                    </li>
                    {/* <li className="nav-item"><a className href="#photos" data-toggle="tab">Photos</a></li>
                                        <li className="nav-item"><a className href="#videos" data-toggle="tab">Videos</a></li>
                                        <li className="nav-item"><a className href="#groups" data-toggle="tab">Groups</a></li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  <div className="col-lg-8">
                    <div className="tab-content">
                      <div className="tab-pane fade active show" id="allposts">
                        <div className="main-wraper">
                          <div className="main-title">
                            Chiến dịch đã tham gia
                          </div>
                          {arrFollowJoin.filter((item) => item.isJoin === "Join")
                            .length === 0 ? (
                            <div>Chưa tham gia chiến dịch</div>
                          ) : (
                            <div>
                              {" "}
                              {arrFollowJoin
                                .filter((item) => item.isJoin === "Join")
                                .map((item, index) => {
                                  return (
                                    <div className="blog-posts mb-3">
                                      {/* <figure><img src={item?.media?.linkMedia} alt /></figure> */}

                                      {/* {item.activity?.media?.map((item, index) => {
                                                                    return <figure key={index}><img src={item.linkMedia} alt /></figure>
                                                                })} */}
                                      <figure key={index}>
                                        <img
                                          src={
                                            item.activity?.media[0]?.linkMedia
                                          }
                                          alt
                                          style={{
                                            height: "250px",
                                            width: "300px",
                                          }}
                                        />
                                      </figure>

                                      <div className="blog-post-meta">
                                        <h4>{item.activity?.title}</h4>
                                        {isReadMore ? (
                                          item?.activity?.description?.length >
                                          100 ? (
                                            <>
                                              {item?.activity?.description}{" "}
                                              <span
                                                style={{
                                                  fontWeight: "bold",
                                                  color: "#2f3640",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  setReadMore(false)
                                                }
                                              >
                                                ...Thu gọn
                                              </span>
                                            </>
                                          ) : (
                                            <>{item?.activity?.description}</>
                                          )
                                        ) : item?.activity?.description
                                            ?.length > 100 ? (
                                          <>
                                            {item?.activity?.description.substring(
                                              0,
                                              100
                                            )}
                                            <span
                                              style={{
                                                fontWeight: "bold",
                                                color: "#2f3640",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => setReadMore(true)}
                                            >
                                              ...Xem thêm
                                            </span>
                                          </>
                                        ) : (
                                          <>{item?.activity?.description}</>
                                        )}
                                        <div style={{ display: "flex" }}>
                                          <div style={{ marginRight: "30px" }}>
                                            <i className="icofont-like" />
                                            <a title="Reads" href="#">
                                              {item.activity?.numberLike}
                                            </a>
                                          </div>
                                          <span>
                                            <i className="icofont-clock-time" />
                                            {DateTime(
                                              item.activity?.createAt
                                            ).toLowerCase()}
                                          </span>
                                        </div>
                                        <NavLink
                                          className="button primary circle"
                                          to={`/detailactivity/${item.activity.activityId}`}
                                          onClick={() => {
                                            const action = GetActivityIDAction(
                                              item.activity.activityId
                                            );
                                            dispatch(action);
                                          }}
                                        >
                                          {" "}
                                          Chi tiết
                                        </NavLink>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="tab-pane fade" id="depart">
                        <div className="main-wraper">
                          <h4 className="main-title">Lịch sử đã ủng hộ</h4>
                          <div className="dept-info">
                            <ul>
                              {arrDonation.length === 0 ? (
                                <div>Chưa ủng hộ cho chiến dịch nào</div>
                              ) : (
                                <Fragment>
                                  {arrDonation.map((item, index) => {
                                    return (
                                      <li>
                                        <h6>
                                          Chiến dịch:{" "}
                                          <span style={{ fontWeight: "bold" }}>
                                            {item.activity.title}
                                          </span>
                                        </h6>
                                        <div>
                                          Thời gian thanh toán:{" "}
                                          {DateTime(item.datetime)}
                                        </div>
                                        <div>
                                          Số tiền:{" "}
                                          <span>
                                            {" "}
                                            <i>
                                              {item.amount.toLocaleString()} vnđ
                                            </i>
                                          </span>
                                        </div>
                                        <div>
                                          Trạng thái:{" "}
                                          <span>
                                            {" "}
                                            <i>{item.status ==="success" ? "ủng hộ thành công" : item.status}</i>
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </Fragment>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="members">
                        <div className="main-wraper">
                          <div className="main-title">
                            Chiến dịch đang theo dõi
                          </div>
                          {arrFollowJoin.filter(
                            (item) => item.isFollow === true
                          ).length === 0 ? (
                            <div>Chưa theo dõi chiến dịch nào</div>
                          ) : (
                            <div>
                              {arrFollowJoin
                                .filter((item) => item.isFollow === true)
                                .map((item, index) => {
                                  const detailItem = item;
                                  return (
                                    <div className="blog-posts mt-4">
                                      {/* {item.activity?.media?.map((item, index) => {
                                                                        return <figure key={index}><img src={item.linkMedia} alt /></figure>
                                                                    })} */}
                                      <figure key={index}>
                                        <img
                                          src={
                                            item.activity?.media[0]?.linkMedia
                                          }
                                          alt
                                          style={{
                                            height: "250px",
                                            width: "300px",
                                          }}
                                        />
                                      </figure>
                                      <div className="blog-post-meta">
                                        <h4>{item?.activity?.title}</h4>
                                        {isReadMore ? (
                                          item?.activity?.description?.length >
                                          100 ? (
                                            <>
                                              {item?.activity?.description}{" "}
                                              <span
                                                style={{
                                                  fontWeight: "bold",
                                                  color: "#2f3640",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  setReadMore(false)
                                                }
                                              >
                                                ...Thu gọn
                                              </span>
                                            </>
                                          ) : (
                                            <>{item?.activity?.description}</>
                                          )
                                        ) : item?.activity?.description
                                            ?.length > 100 ? (
                                          <>
                                            {item?.activity?.description.substring(
                                              0,
                                              100
                                            )}
                                            <span
                                              style={{
                                                fontWeight: "bold",
                                                color: "#2f3640",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => setReadMore(true)}
                                            >
                                              ...Xem thêm
                                            </span>
                                          </>
                                        ) : (
                                          <>{item?.activity?.description}</>
                                        )}
                                        <div style={{ display: "flex" }}>
                                          <div style={{ marginRight: "30px" }}>
                                            <i className="icofont-like" />
                                            <a title="Reads" href="#">
                                              {item.activity?.numberLike}
                                            </a>
                                          </div>
                                          <span>
                                            <i className="icofont-clock-time" />
                                            {DateTime(item.activity?.createAt)}
                                          </span>
                                        </div>
                                        {/* <a data-toggle="modal" data-target="#img-comt" title className="button primary circle" onClick={() => {
                                                                            setDetail(detailItem)
                                                                        }}>Chi tiết</a> */}
                                        <NavLink
                                          className="button primary circle"
                                          to={`/detailactivity/${item.activity.activityId}`}
                                          onClick={() => {
                                            const action = GetActivityIDAction(
                                              item.activity.activityId
                                            );
                                            dispatch(action);
                                          }}
                                        >
                                          {" "}
                                          Chi tiết
                                        </NavLink>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}

                          {/* <div className="load mt-5 mb-4">
                                                        <ul className="pagination">
                                                            <li><a href="#" title><i className="icofont-arrow-left" /></a></li>
                                                            <li><a className="active" href="#" title>1</a></li>
                                                            <li><a href="#" title>2</a></li>
                                                            <li><a href="#" title>3</a></li>
                                                            <li><a href="#" title>4</a></li>
                                                            <li><a href="#" title>5</a></li>
                                                            <li>....</li>
                                                            <li><a href="#" title>10</a></li>
                                                            <li><a href="#" title><i className="icofont-arrow-right" /></a></li>
                                                        </ul>
                                                    </div> */}
                        </div>
                      </div>
                      <div className="tab-pane fade" id="photos">
                        <div className="main-wraper">
                          <h4 className="main-title">
                            Photos{" "}
                            <a href="#" title>
                              view all
                            </a>
                          </h4>
                          <div className="row merged-10 remove-ext20">
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/light.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/light.jpg" alt />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/dark.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/dark.jpg" alt />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/image.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/image.jpg" alt />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/image2.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/image2.jpg" alt />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/image3.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/image3.jpg" alt />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="images-post">
                                <a
                                  className="uk-inline"
                                  href="images/elements/image4.jpg"
                                  data-fancybox
                                >
                                  <img src="images/elements/image4.jpg" alt />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="videos">
                        <div className="main-wraper">
                          <h4 className="main-title">
                            Videos{" "}
                            <a href="#" title>
                              view all
                            </a>
                          </h4>
                          <div className="row merged-10 remove-ext20">
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video1.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video2.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video3.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video4.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video5.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video6.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video6.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video8.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video9.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video10.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video11.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                              <div className="video-posts">
                                <img
                                  src="images/resources/post-video6.jpg"
                                  alt
                                />
                                <a
                                  className="play-btn"
                                  data-fancybox
                                  href="https://www.youtube.com/watch?v=nOCXXHGMezU&feature=emb_title"
                                >
                                  <i className="icofont-play" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="groups">
                        <div className="main-wraper">
                          <h4 className="main-title">Tổ chức</h4>
                          <div className="row col-xs-6">
                            <div className="col-lg-3 col-md-4 col-sm-4">
                              <div className="group-box">
                                <figure>
                                  <img alt src="images/resources/group1.jpg" />
                                </figure>
                                <a title href="#">
                                  Sports Punch
                                </a>
                                <span>Số lượt thích: 152 like</span>
                                <button>Theo dõi</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <aside className="sidebar static right">
                      <div className="widget">
                        <h4 className="widget-title">Lịch sử</h4>
                        <ul className="widget-analytics">
                          <li>
                            Chiến dịch đã theo dõi
                            <span>
                              {
                                arrFollowJoin.filter(
                                  (item) => item.isFollow === true
                                ).length
                              }
                            </span>
                          </li>
                          <li>
                            Chiến dịch tham gia
                            <span>
                              {
                                arrFollowJoin.filter(
                                  (item) => item.isJoin === "Join"
                                ).length
                              }
                            </span>
                          </li>
                          <li>
                            Số lần ủng hộ <span>{arrDonation.length}</span>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="widget">
                                                <h4 className="widget-title">Ask Research Question?</h4>
                                                <div className="ask-question">
                                                    <i className="icofont-question-circle" />
                                                    <h6>Ask questions in Q&amp;A to get help from experts in your field.</h6>
                                                    <a className="ask-qst" href="#" title>Ask a question</a>
                                                </div>
                                            </div>
                                            <div className="widget">
                                                <h4 className="widget-title">Explor Events <a className="see-all" href="#" title>See All</a></h4>
                                                <div className="rec-events bg-purple">
                                                    <i className="icofont-gift" />
                                                    <h6><a title href>BZ University good night event in columbia</a></h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                                <div className="rec-events bg-blue">
                                                    <i className="icofont-microphone" />
                                                    <h6><a title href>The 3rd International Conference 2020</a></h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                            </div>
                                            <div className="widget stick-widget">
                                                <h4 className="widget-title">Who's follownig</h4>
                                                <ul className="followers">
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Kelly Bill</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar2.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Issabel</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar3.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Andrew</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar4.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Sophia</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar5.jpg" /></figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Allen</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div> */}
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <figure className="bottom-mockup">
        <img src="images/footer.png" alt />
      </figure>
    </div>
  );
}
