import React, { useState } from "react";
import { useEffect } from "react";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleUserAction } from "./redux/actions/UserAction";
import moment from "moment";

const MyCalendar = (props) => {
  const [arr, setArr] = useState([]);
  const dispatch = useDispatch();
  const { userID } = useSelector((root) => root.LoginReducer);
  const { userSchedule } = useSelector((root) => root.UserReducer);
  const { getUserId } = useSelector((root) => root.ProfileReducer);
  useEffect(() => {
    const action = ScheduleUserAction(userID);
    dispatch(action);
  }, []);
  console.log(userSchedule);
  const arrShe = userSchedule.map((item, index) => {
    const datetimeStrings = item?.process?.filter((process) => process.processTypeId === "pt003").map((process) => process.startDate);
    const datetimeStringEnd = item?.process?.filter((process) => process.processTypeId === "pt003").map((process) => process.endDate);

    let day = "";
    let month = "";
    let year = "";
    let hour = "";
    let minute = "";

    if (datetimeStrings && datetimeStrings.length > 0) {
      datetimeStrings.forEach((datetimeString) => {
        const yearString = datetimeString.slice(0, 4);
        const monthString = datetimeString.slice(5, 7);
        const dayString = datetimeString.slice(8, 10);
        const hourString = datetimeString.slice(11, 13);
        const minuteString = datetimeString.slice(14, 16);

        year = yearString;
        month = monthString;
        day = dayString;
        hour = hourString;
        minute = minuteString;
      });
    }

    let day1 = "";
    let month1 = "";
    let year1 = "";
    let hour1 = "";
    let minute1 = "";

    if (datetimeStringEnd && datetimeStringEnd.length > 0) {
      const datetimeString = datetimeStringEnd[0]; // Lấy giá trị đầu tiên từ datetimeStrings
      year1 = datetimeString.slice(0, 4);
      month1 = datetimeString.slice(5, 7);
      day1 = datetimeString.slice(8, 10);
      hour1 = datetimeString.slice(11, 13);
      minute1 = datetimeString.slice(14, 16);
    }

    return {
      actiID: item?.activityId,
      tile: item?.title,
      process: item?.process?.filter((process) => process.processTypeId === "pt003"),
      day: Number(day),
      month: month - 1,
      year: Number(year),
      hour: Number(hour),
      minute: Number(minute),
      day1: Number(day1),
      month1: month1 - 1,
      year1: Number(year1),
      hour1: Number(hour1),
      minute1: Number(minute1),
    };
  });
  console.log(arrShe);
  useEffect(() => {
    setArr(
      arrShe.map((date, idnex) => {
        return {
          startDate: new Date(date.year, date.month, date.day),
          endDate: new Date(date.year1, date.month1, date.day1),
          title: date.tile,
          hour: date.hour,
          min: date.minute,
          actiID: date.actiID,
        };
      })
    );
  }, [userSchedule]);

  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  // const events = [
  //   { startDate: new Date(2023, 8, 25), endDate: new Date(2023, 8, 28), title: 'Sự kiện A', content: 'Nội dung sự kiện A' },
  //   { startDate: new Date(2023, 8, 27), endDate: new Date(2023, 8, 30), title: 'Sự kiện B', content: 'Nội dung sự kiện B' },
  //   // Thêm các sự kiện khác vào đây
  // ];

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasEvent = arr.some(
        (event) => date >= event.startDate && date <= event.endDate
      );
      return hasEvent ? <div className="event-dot"></div> : null;
    }
    return null;
  };
const[days,setDay] = useState('')
  const handleDayClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setDay(dateString)
    const dayEvents = arr.filter(
      (event) =>
        dateString >= event.startDate.toISOString().split("T")[0] &&
        dateString <= event.endDate.toISOString().split("T")[0]
    );
    console.log(dayEvents);
    if (dayEvents.length > 0) {
      const popupContent = dayEvents.map((event,index) => (
        <div key={index}>
       <div style={{fontSize:'20px', textAlign:'center' , cursor:'pointer'}} onClick={()=>{
        props.history.push(`/detailactivity/${event.actiID}`)
       }}><span style={{fontSize:'20px',color:"#007bff"}}>{event.title}</span></div>

         <div style={{paddingLeft:'20px'}}>Thời gian: <span>{moment(event?.startDate).format("DD/MM/YYYY hh:mm A")} -</span> <span>{moment(event?.endDate).format("DD/MM/YYYY hh:mm A")}</span></div>
          <hr />
        </div>
      ));

      setPopupContent(popupContent);
      setShowPopup(true);
    } else {
      
      const popupContent = "Không có chiến dịch nào trong ngày"
      setPopupContent(popupContent); // Đặt giá trị của popupContent thành null để không hiển thị nội dung
      setShowPopup(true); // Mở popup
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Calendar
        className="calen"
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        onClickDay={handleDayClick}
      />
      {showPopup && (
        <div className="" style={{ marginTop: "200px" }}>
          <div className="popup" style={{ padding: "20px 0" }}>
            <div>
              <span
                onClick={closePopup}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "5px",
                  color: "#088dcd",
                  fontSize: "20px",
                  border: "1px solid #088dcd",
                  padding: "0 10px 2px 10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                x
              </span>
            </div>
            <div
              style={{ textAlign: "center", fontSize: "20px", fontWeight: 800 }}
            >
              Chiến dịch trong ngày  {moment(days).format('DD/MM/YYYY')}
            </div>
            <div style={{ paddingTop: "30px" }}>{popupContent}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
