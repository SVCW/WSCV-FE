import React, { useEffect, useState } from "react";
import YourFanpage from "./YourFanpage";
import RecommentActivity from "./RecommentActivity";
import Game from "./Game";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleUserAction } from "../redux/actions/UserAction";
import YourFanpage1 from "./YourFanpage1";

export default function Other1() {
  const [arr ,setArr] = useState([])
  const dispatch = useDispatch();
  const { userID } = useSelector((root) => root.LoginReducer);
  const { userSchedule } = useSelector((root) => root.UserReducer);
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
    <div className="col-lg-12">
      <aside className="sidebar static right">
        {/* <RecommentActivity /> */}
       {/* <Calendar arr ={arr}/> */}
       <YourFanpage1 />
      </aside>
    </div>
  );
}
