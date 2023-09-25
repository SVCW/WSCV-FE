import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import RecommentActivity from "./RecommentActivity";
import Game from "./Game";
import Calender from "./Calender";
import { ScheduleUserAction } from "../redux/actions/UserAction";
import { useState } from "react";

export default function YourFanpage () {
  const [arr ,setArr] = useState([])
  const dispatch = useDispatch();
  const { userID } = useSelector((root) => root.LoginReducer);
  const { userSchedule } = useSelector((root) => root.UserReducer);
  const { getUserId } = useSelector((root) => root.ProfileReducer);
  useEffect(() => {
    const action = ScheduleUserAction(userID);
    dispatch(action);
  }, []);
  const arrShe = userSchedule?.map((item, index) => {
    const datetimeStrings = item?.process?.filter(item => item.processTypeId === "pt003").map(process => process.startDate);

    let day = "";
    let month = "";
    let year = "";
    let hour = "";
    let minute = "";

    if (datetimeStrings && datetimeStrings.length > 0) {
        const datetimeString = datetimeStrings[0]; // Lấy giá trị đầu tiên từ datetimeStrings

        const [ yearString, monthString, dayString, hourString, minuteString] = datetimeString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

        day = dayString;
        month = monthString;
        year = yearString;
        hour = hourString;
        minute = minuteString;
    }
   
    return {
        actiID: item?.activityId,
        tile: item?.title,
        process: item?.process?.filter(item => item.processTypeId === "pt003"),
        day: Number(day),
        month: month-1,
        year: Number(year),
        hour: Number(hour),
        minute: Number(minute)
    };
});
useEffect(()=>{
  setArr(arrShe.map((item,idnex)=>{
    return   { date: new Date(item.year, item.month, item.day, item.hour, item.minute), title: item.tile , hour:item.hour, min:item.minute ,actiID:item.actiID }
  }))
},[userSchedule])

  return (
    <div className="">
      <aside className="sidebar static right">
        {localStorage.getItem("userID") &&
          getUserId?.fanpage?.status === "Active" ? (
          <div className="widget">
            <h4 className="widget-title">Tổ chức của bạn</h4>
            <ul className="ak-groups">
              <li>
                <figure>
                  <NavLink to={`/fanpage/${localStorage.getItem("userID")}`}>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectfit: "cover",
                      }}
                      src={getUserId?.fanpage?.avatar}
                      alt
                    />
                  </NavLink>
                </figure>
                <div className="your-grp">
                  <h5>
                    <NavLink
                      to={`/fanpage/${localStorage.getItem("userID")}`}
                      title
                      style={{
                        fontSize: "20px",
                        width: "350px",

                      }}
                    >
                      {getUserId?.fanpage?.fanpageName}
                    </NavLink>
                  </h5>
                  <NavLink
                    to={`/fanpage/${localStorage.getItem("userID")}`}
                    href="group-feed.html"
                    title
                    className="fanpage-y"
                    onClick={() => { }}
                  >
                    Chi tiết
                  </NavLink>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div></div>
        )}
        <RecommentActivity />
        <Calender arr ={arr}/>
        {/* <Game /> */}
        
      </aside>
    </div>
  );
}
