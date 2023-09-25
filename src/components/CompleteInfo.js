import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserBystatisticAction } from "../redux/actions/UserAction";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

export default function CompleteInfo () {
  const dispatch = useDispatch();
  const { userByStatis, usertotal } = useSelector((root) => root.UserReducer);
  const change = usertotal.replace(",", ".");
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (userID !== "") {
      const action8 = GetUserBystatisticAction(userID);
      dispatch(action8);
    }
  }, []);
  return (
    <div className="widget">
      <h4 className="widget-title">Thông tin cá nhân bạn</h4>
      <span>Hoạt động hoàn thiện thông tin cá nhân</span>
      <div
        data-progress="tip"
        className="progress__outer"
        data-value={change.toString()}
      >
        <div className="progress__inner">
          {(parseFloat(change) * 100).toFixed(1)}%
        </div>
      </div>
      <ul className="prof-complete">
        {userByStatis.phone === null ? (
          <li>
            <i className="icofont-plus-square" />{" "}
            <NavLink to={`/profile/${localStorage.getItem('userID')}`}>Cập nhật số điện thoại</NavLink>
            <em>10%</em>
          </li>
        ) : (
          <div></div>
        )}
        {userByStatis.fullName === "none" ? (
          <li>
            <i className="icofont-plus-square" />{" "}
            <NavLink to={`/profile/${localStorage.getItem('userID')}`}>Cập nhật họ tên</NavLink>
            <em>10%</em>
          </li>
        ) : (
          <div></div>
        )}
        {userByStatis.image === "none" ? (
          <li>
            <i className="icofont-plus-square" />{" "}
            <NavLink to={`/profile/${localStorage.getItem('userID')}`}>Cập nhật avartar</NavLink>
            <em>10%</em>
          </li>
        ) : (
          <div></div>
        )}
        {userByStatis.coverImage === "none" ? (
          <li>
            <i className="icofont-plus-square" />{" "}
            <NavLink to={`/profile/${localStorage.getItem('userID')}`}>Cập nhật ảnh bìa</NavLink>
            <em>10%</em>
          </li>
        ) : (
          <div></div>
        )}
        {moment(userByStatis.dateOfBirth).format('YYYY-MM-DD') === "0001-01-01" ? (
          <li>
            <i className="icofont-plus-square" />{" "}
            <NavLink to={`/profile/${localStorage.getItem('userID')}`}>Cập nhật ngày sinh nhật</NavLink>
            <em>10%</em>
          </li>
        ) : (
          <div></div>
        )}
      </ul>
    </div>
  );
}
