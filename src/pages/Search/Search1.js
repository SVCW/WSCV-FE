
// import React, { useEffect } from 'react'
// import { NavLink } from 'react-router-dom'
// import Clock from '../../components/Clock'
// import { GetUserByIdAction, GetUserBystatisticAction, } from '../../redux/actions/UserAction';
// import { useDispatch, useSelector } from 'react-redux';
// import { GetProfileByIdAction } from '../../redux/actions/ProfileAction';
// import CompleteInfo from '../../components/CompleteInfo';
// import CreateActivity from '../../components/CreateActivity';
// import SuggestedFanpage from './SuggestedFanpage';
// import { GetListFanpageAction } from '../../redux/actions/FanpageAction';
// import { GetActivityTitleAction, GetListActivityAction, GetListEndActivityAction, GetRecommentActivityAction } from '../../redux/actions/ActivityAction';
// import ItemEndActivity from '../../components/ItemEndActivity';
// import ListEndActivity from '../../components/ListEndActivity';
// import YourFanpage from '../../components/YourFanpage';
// import { GetListReportAction, GetListReportByTypeAction } from '../../redux/actions/ReportAction';
// import EndActivity from '../Profile/EndActivity';
// import RecommentActivity from '../../components/RecommentActivity';
// import { GetListProcessTypeAction } from '../../redux/actions/ProcessTypeAction';
// import Swal from 'sweetalert2';
// import { useState } from 'react';
// import ListDonateDone from '../../components/ListDonateDone';
// import Calender from '../../components/Calender';
// export default function Home (props) {
//     const dispatch = useDispatch()
//     const { userID } = useSelector((root) => root.LoginReducer);
//     const { arrFanpage } = useSelector((root) => root.FanpageReducer);
//     const { arrActivity, activityId, arrActivityRecomment } = useSelector((root) => root.ActivityReducer);
//     const { arrEndActivity } = useSelector((root) => root.EndActivityReducer);
//     const [isMatch, setIsMatch] = useState(false);
//     useEffect(() => {
//         const stringToCompare = 'success';
//         const currentUrl = window.location.href;
//         const match = currentUrl.includes(stringToCompare);
//         setIsMatch(match);
//          if (match) {
//             Swal.fire({
//                 title: 'Thành công!',
//                 text: 'Bạn đã ủng hộ thành công cho chiến dịch!',
//                 icon: 'success',
//             }).then((result) => {
//                 props.history.push('/home')
//                 setIsMatch(false);
//             });
//         }
  
//         const action3 = GetListActivityAction();
//         dispatch(action3)
//         // const action = GetUserByIdAction(localStorage.getItem('userID'));
//         // dispatch(action);
//         const action1 = GetProfileByIdAction(userID);
//         dispatch(action1)
//         const action2 = GetListFanpageAction();
//         dispatch(action2)
//         const action4 = GetListReportAction();
//         dispatch(action4);
//         const action5 = GetListEndActivityAction();
//         dispatch(action5)
//         const action9 = GetRecommentActivityAction(userID);
//         dispatch(action9);
//         const action10 = GetListProcessTypeAction();
//         dispatch(action10)
//     }, []);

//     return (
//         <div className="theme-layout">
//             <section>
//                 <div className="gap">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-lg-12">
//                                 <div id="page-contents" className="row merged20">
//                                     <div className="col-lg-3">
//                                         <aside className="sidebar static left">
//                                             <Clock />
//                                             <ListDonateDone />
//                                             <CompleteInfo />
                                          
//                                         </aside>
//                                     </div>
//                                     <div className="col-lg-6">
//                                     <div
//         className="container "
//         style={{ fontSize: "20px", fontWeigh: 800, paddingTop: "100px" }}
//       >
//         Kết quả tìm kiếm cho: <span style={{ fontWeight: 800 }}>{title}</span>
//       </div>
//       <div className="search-container-1">
//         <div
//           className="search-input-1"
//           style={{ fontWeight: 700, fontSize: "20px" }}
//         >
//           Bài viết
//         </div>
//         <div className="search-results-1">
//           {arrActivitySearch?.activities?.length === 0 ? (
//             "Không tìm thấy kết quả phù hợp"
//           ) : (
//             <Fragment>
//               {arrActivitySearch?.activities?.map((item, index) => {
//                 return (
//                   <div className="search-result-1" style={{ display: "flex" }}>
//                     <div style={{ width: "15%" }}>
//                       <div>
//                         {item.image?.length === 0 ? (
//                           <img src="../images/avatar.jpg" />
//                         ) : (
//                           <img src={item.media?.[0]?.linkMedia} />
//                         )}
//                       </div>
//                     </div>
//                     <div style={{ width: "75%", marginLeft: "20px" }}>
//                     <h5><NavLink to={`/detailactivity/${item.activityId}`}>{item.title}</NavLink></h5>
//                       <p>{item.description.slice(0, 200)}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </Fragment>
//           )}
//         </div>
//       </div>
//       <div className="search-container-1">
//         <div
//           className="search-input-1"
//           style={{ fontWeight: 700, fontSize: "20px" }}
//         >
//           Mọi người
//         </div>
//         <div className="search-results-1">
//             {arrActivitySearch?.users?.length === 0? (
//             "Không tìm thấy kết quả phù hợp"
//           ) :
//           <Fragment>
//             {arrActivitySearch?.users?.map((item, index) => {
//             return (
//               <div className="search-result-1" style={{ display: "flex" }}>
//                 <div style={{ width: "15%" }}>
//                   <div>
//                     {item.image === "none" ? (
//                       <img src="../images/avatar.jpg" />
//                     ) : (
//                       <img src={item.image} />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ width: "75%", marginLeft: "20px" }}>
//                   <h5><NavLink to={`/profile/${item.userId}`}>{item.fullName}</NavLink></h5>
//                   <p>{item.username}</p>
//                 </div>
//               </div>
//             );
//           })}
//           </Fragment>
// }
//         </div>
//       </div>
//       <div className="search-container-1">
//         <div
//           className="search-input-1"
//           style={{ fontWeight: 700, fontSize: "20px" }}
//         >
//          Tổ chức
//         </div>
//         <div className="search-results-1">
//             {arrActivitySearch?.fanpages?.length === 0? (
//             "Không tìm thấy kết quả phù hợp"
//           ) :
//           <Fragment>
//             {arrActivitySearch?.fanpages?.map((item, index) => {
//             return (
//               <div className="search-result-1" style={{ display: "flex" }}>
//                 <div style={{ width: "15%" }}>
//                   <div>
//                     {item.image === "none" ? (
//                       <img src="../images/avatar.jpg" />
//                     ) : (
//                       <img src={item.avatar} />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ width: "75%", marginLeft: "20px" }}>
//                   <h5><NavLink  to={`/fanpage/${item.fanpageId}`}>{item.fanpageName}</NavLink></h5>
//                   <p>{item.description}</p>
//                 </div>
//               </div>
//             );
//           })}
//           </Fragment>
// }
//         </div>
//       </div>
//                                     </div>
//                                     <div className='col-lg-3'>
//                                         <YourFanpage />
                                       
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>{/* content */}
//             <figure className="bottom-mockup"><img src="images/footer.png" alt /></figure>
//             <div className="bottombar">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             {/* <span className>WSCV</span> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

