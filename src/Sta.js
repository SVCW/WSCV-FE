// import React, { useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
// import { useDispatch, useSelector } from "react-redux";
// import { useState } from "react";
// import { GetStatisticalAction, GetStatisticalAdminAction, GetStatisticalAdminDonateAction } from "../../redux/actions/StatisticalAction";

// const AdminStatistical = (props) => {
//   const [selectedValue, setSelectedValue] = useState(true);
//   const [selectedValue1, setSelectedValue1] = useState(true);

//   const handleOptionClick = (value) => {
//     setSelectedValue(value);
//   };
//   const handleOptionClick1 = (value) => {
//     setSelectedValue1(value);
//   };
//   const dispatch = useDispatch();
//   const { arrStaticaladmin,arrStaticalAdminDonate } = useSelector((root) => root.StatisticalReducer);
//   console.log(arrStaticalAdminDonate);
//   useEffect(() => {
//     const action = GetStatisticalAdminAction( year);
//     dispatch(action);
//     const action1 = GetStatisticalAdminDonateAction( year);
//     dispatch(action1);
//   }, []);
//   const [year, setYear] = useState("2023");
//   const [year1, setYear1] = useState("2023");
//   const arr1 = arrStaticaladmin?.map((item, index) => {
//     return selectedValue
//       ? item.newUser
//       : item.newUser;
//   });
//   const arr = arrStaticalAdminDonate?.map((item, index) => {
//     return selectedValue1
//       ? item.target
//       : item.target;
//   });
//   const series = [
//     {
//       name: "Số tiền ủng hộ",
//       data: arr ,
//     },
//   ];
//   const series1 = [
//     {
//       name: "Số tình nguyện viên",
//       data: arr1,
//     },
//   ];
//   const options = {
//     chart: {
//       height: 350,
//       type: "line",
//       zoom: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: "straight",
//     },
//     title: {
//       text: selectedValue
//         ? "Thống kê số chiến dịch đã tạo"
//         : "Thống kê số tiền đã ủng hộ",
//       align: "left",
//       style: {
//         color: selectedValue ? "#0077b6" : "#0077b6", // Đổi màu tùy theo selectedValue
//         fontSize: selectedValue ? "30px" : "30px",
//       },
//     },
//     grid: {
//       row: {
//         colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
//         opacity: 0.5,
//       },
//     },
//     xaxis: {
//       categories: [
//         "Tháng 1",
//         "Tháng 2",
//         "Tháng 3",
//         "Tháng 4",
//         "Tháng 5",
//         "Tháng 6",
//         "Tháng 7",
//         "Tháng 8",
//         "Tháng 9",
//         "Tháng 10",
//         "Tháng 11",
//         "Tháng 12",
//       ],
//     },
//   };
//   const options1 = {
//     chart: {
//       height: 350,
//       type: "line",
//       zoom: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: "straight",
//     },
//     title: {
//       text: selectedValue1
//         ? "Thống kê số chiến dịch đã tạo"
//         : "Thống kê số tiền đã ủng hộ",
//       align: "left",
//       style: {
//         color: selectedValue1 ? "black" : "#0077b6", // Đổi màu tùy theo selectedValue
//         fontSize: selectedValue1 ? "30px" : "30px",
//       },
//     },
//     grid: {
//       row: {
//         colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
//         opacity: 0.5,
//       },
//     },
//     xaxis: {
//       categories: [
//         "Tháng 1",
//         "Tháng 2",
//         "Tháng 3",
//         "Tháng 4",
//         "Tháng 5",
//         "Tháng 6",
//         "Tháng 7",
//         "Tháng 8",
//         "Tháng 9",
//         "Tháng 10",
//         "Tháng 11",
//         "Tháng 12",
//       ],
//     },
//   };

//   return (
//     <div className="" style={{position:'absolute', marginTop:'10px',  width: "1800px"}}>
//       <div className="">
//         <section>
//           <div className="top-area bluesh high-opacity">
//             <div
//               className="bg-image"
//               style={{ backgroundImage: "url(images/resources/top-bg.jpg)" }}
//             />
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="post-subject">
//                     <div className="university-tag">
//                       <div className="Search-result">
//                         <h4>
//                           {" "}
//                           <strong>Thống kê</strong>
//                         </h4>
//                       </div>
//                     </div>
//                     <ul className="nav nav-tabs post-detail-btn">
//                       <li
//                         className="nav-item"
//                         onClick={() => handleOptionClick(true)}
//                       >
//                         <a
//                           className="active"
//                           href="#allposts"
//                           data-toggle="tab"
//                         >
//                           Tình nguyện viên tham gia SVCW
//                         </a>
//                       </li>
//                       <li
//                         className="nav-item"
//                         onClick={() => handleOptionClick1(false)}
//                       >
//                         <a className href="#members" data-toggle="tab">
//                           Số tiền ủng hộ đã nhận trên SVCW
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section>
//           <div className="gap" style={{padding:0}}>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div id="page-contents" className="row merged20">
//                     <div className="col-lg-12">
//                       <div className="tab-content">
//                         <div
//                           className="tab-pane fade active show"
//                           id="allposts"
//                         >
//                           <div className="main-wraper">
//                             <div style={{ display: "flex" }}>
//                               <div className="main-title">
//                                 Tình nguyện viên tham gia trên SVCW năm {year}
//                               </div>
//                               <select
//                                 style={{
//                                   width: "80px",
//                                   height: "20px",
//                                   border: "transparent",
//                                 }}
//                                 onClick={(e) => {
//                                   setYear(e.target.value);
//                                   const action = GetStatisticalAdminAction(
//                                     e.target.value
//                                   );
//                                   dispatch(action);
//                                 }}
//                               >
//                                 <option value="2022">2022</option>
//                                 <option value="2023" selected>
//                                   2023
//                                 </option>
//                                 <option value="2024">2024</option>
//                               </select>
//                             </div>
//                             <ReactApexChart
//                               options={options}
//                               series={series1}
//                               type="line"
//                               height={350}
//                             />
//                           </div>
//                         </div>
//                         <div
//                           className="tab-pane fade show"
//                           id="members"
//                         >
//                           <div className="main-wraper">
//                             <div style={{ display: "flex" }}>
//                               <div className="main-title">
//                                 Số tiền ủng hộ nhận được trên SVCW năm {year1}
//                               </div>
//                               <select
//                                 style={{
//                                   width: "80px",
//                                   height: "20px",
//                                   border: "transparent",
//                                 }}
//                                 onClick={(e) => {
//                                   setYear1(e.target.value);
//                                   const action = GetStatisticalAdminDonateAction(
//                                     e.target.value
//                                   );
//                                   dispatch(action);
//                                 }}
//                               >
//                                 <option value="2022">2022</option>
//                                 <option value="2023" selected>
//                                   2023
//                                 </option>
//                                 <option value="2024">2024</option>
//                               </select>
//                             </div>
//                             <ReactApexChart
//                               options={options1}
//                               series={series}
//                               type="line"
//                               height={350}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
      
//     </div>
//   );
// };

// export default AdminStatistical;
