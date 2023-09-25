import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import styles from "./RecommentActivity.module.css";
import { FollowAction, UnFollowAction } from '../redux/actions/FollowJoinAction';
import Swal from 'sweetalert2';
import { GetRecommentActivityAction } from '../redux/actions/ActivityAction';
import {NavLink} from 'react-router-dom'
export default function RecommentActivity () {
  const { arrActivityRecomment } = useSelector((root) => root.ActivityReducer);
  const { userID } = useSelector((root) => root.LoginReducer);
  const dispatch = useDispatch()

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  
  };
  settings.nextArrow = <style>{`
  .slick-next {
    position: absolute;
    right: -19px;
}
  }

`}</style>;
settings.prevArrow = <style>{`
.slick-prev:before {
  content: '←';
  position: absolute;
  left: 7px;
  z-index: 9999;
}
}

`}</style>;
  useEffect(()=>{
    const action9 = GetRecommentActivityAction(userID);
    dispatch(action9);
  },[])

  return (
    <div style={{ position: 'relative' }}>
      <Slider {...settings} className={styles["slick-slider"]}>

        {arrActivityRecomment.map((item, index) => {

          return <div className="widget">
            <h4 className="widget-title">Đề xuất tìm kiếm</h4>
            <NavLink
                    to={`/detailactivity/${item.activityId}`}>
            <h3 className="widget-title" style={{ color: ' #1572b8' }}>{item.title}</h3>
            </NavLink>
            <div className="sug-caro">

              <div className="friend-box">
                <figure>
                  <img
                    style={{
                      width: "310px",
                      height: "110px",
                      objectFit: "cover",
                    }}
                    alt
                    src={item.media[0]?.linkMedia}
                  />
                  <span>Lượt thích: {item.like?.length}</span>
                </figure>
                <div className="frnd-meta">
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      objectfit: "cover",
                      display: "block",
                    }}
                    alt
                    src={item.media[0]?.linkMedia}
                  />
                  <div className="frnd-name" style={{ paddingTop: '10px' }}>

                    <span>@{item.user?.username}</span>
                  </div>


                  {item.followJoinAvtivity?.map((item1, index) => {
                    if (item1.userId === userID) {
                      return item1.isFollow ? <div className="btnfollow" onClick={() => {
                        const action = UnFollowAction(item.activityId, userID);
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
                          title: `Bỏ theo dõi chiến dịch ${item.title} thành công `,
                        });
                      }}>
                        Đang theo dõi
                      </div> : <div className="btnfollow" title onClick={() => {
                        const action = FollowAction(item.activityId, userID);
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
                          title: `Theo dõi chiến dịch ${item.title} thành công `,
                        });
                      }}>
                        Theo dõi
                      </div>
                    }
                  })
                  }


                </div>
              </div>
            </div>
          </div>
        })}

      </Slider>
    </div>
  )
}
