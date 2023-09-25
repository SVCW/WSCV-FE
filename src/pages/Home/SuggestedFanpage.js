import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  FollowFanpageAction,
  GetFanpageByIDAction,
  GetListFanpageAction,
  UnFollowFanpageAction,
} from "../../redux/actions/FanpageAction";
import { useEffect } from "react";

function SuggestedFanpage (props) {
  const { userID } = useSelector((root) => root.LoginReducer);
  const dispatch = useDispatch()
  const { arrFanpage } = useSelector((root) => root.FanpageReducer);
  useEffect(() => {
    const action1 = GetListFanpageAction();
    dispatch(action1);
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  const handleFollowClick = (index, activity, isFollow, title) => {
    if (isFollow) {
      const action = UnFollowFanpageAction(userID, activity);
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
        title: `Hủy theo dõi fanpage ${title} thành công`,
      });
    } else {
      const action = FollowFanpageAction(userID, activity);
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
        title: `Theo dõi fanpage ${title} thành công`,
      });
    }
  };

  return (
    <div className="main-wraper">
      <div className="user-post">
        <div className="friend-info">
          <figure>
            <i className="icofont-learn" />
          </figure>
          <div className="friend-name">
            <ins>
              <a title href="time-line.html">
                Đề xuất
              </a>
            </ins>
            <span>
              <i className="icofont-runner-alt-1" /> Theo dõi tổ chức tương tự
            </span>
          </div>
          <Slider {...settings}>
            {arrFanpage?.filter((item) => item.status === "Active").map((item, index) => {
              let isAlreadyFollowed = false;
              item?.followFanpage?.map((user) => {
                if (user.userId === userID) {
                  isAlreadyFollowed = user.status;
                }
              });
              return (
                <div className="suggested-caro">
                  <li>
                    {/* <figure style={{ cursor: 'pointer' }} ><img src={item.avatar} style={{ height: '80px' }} /></figure> */}
                    <NavLink
                      to={`/fanpage/${item.fanpageId}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        localStorage.setItem('fanpagedatail', item.fanpageId)
                        const action = GetFanpageByIDAction(item.fanpageId);
                        dispatch(action)
                      }}
                    >
                      <figure>
                        {item.avatar ==="none"?  <img src="./../images/giphy-sample.gif" style={{
                            margin: "0 2.5rem",
                            height: "80px",
                            width: "90px",
                            objectFit: "cover",
                          }} /> :
                        <img
                          src={item.avatar}
                          style={{
                            margin: "0 2.5rem",
                            height: "80px",
                            width: "90px",
                            objectFit: "cover",
                          }}
                        />}
                      </figure>
                    </NavLink>
                    <span
                      className="title-suggest "
                      style={{ paddingLeft: "25px", width: "150px" }}
                    >
                      {item.fanpageName}
                    </span>
                    {/* <ins>{(item.description).slice(0, 200)}</ins> */}
                    <div
                      style={{
                        width: "110px",
                        background: `${isAlreadyFollowed ? 'white none repeat scroll 0 0' :'#088dcd none repeat scroll 0 0'}`,
                        border: `${isAlreadyFollowed ? '1px solid rgb(8, 141, 205)' :'none'}`,
                        borderRadius: "16px",
                        color: `${isAlreadyFollowed ? 'rgb(8, 141, 205)' :'#fff'}`,
                        display: "block",
                        marginLeft: "30px",
                        fontSize: "12px",
                        marginTop: "10px",
                        padding: " 5px 10px",
                        cursor: "pointer",
                      }}
                      title
                      data-ripple
                      onClick={() => {
                        handleFollowClick(
                          index,
                          item.fanpageId,
                          isAlreadyFollowed,
                          item.fanpageName
                        );
                      }}
                    >
                      <i className="icofont-star" />
                      {isAlreadyFollowed ? "Hủy theo dõi" : "Theo dõi"}
                    </div>
                  </li>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default SuggestedFanpage;
