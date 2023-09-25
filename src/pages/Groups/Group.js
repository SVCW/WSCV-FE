
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { FollowFanpageAction, GetListFanpageAction, UnFollowFanpageAction } from '../../redux/actions/FanpageAction';
import Swal from 'sweetalert2';
export default function Group () {
    const { userID } = useSelector((root) => root.LoginReducer);
    const dispatch = useDispatch()
    const { arrFanpage } = useSelector((root) => root.FanpageReducer);
    useEffect(() => {
        const action1 = GetListFanpageAction();
        dispatch(action1);
    }, []);

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
                title: `Bỏ theo dõi thành công chiến dịch ${title}`,
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
                title: `Theo dõi thành công chiến dịch ${title}`,
            });
        }
    };

    return (

        <Fragment>
            <div>

            </div>
            <section>
                <div className="gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <div className="col-lg-12">
                                        <div className="main-wraper">
                                            <h4 className="main-title"><i className><svg className="feather feather-users" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={18} width={18} xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle r={4} cy={7} cx={9} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></i> Tổ chức</h4>
                                            <div className="row col-xs-6">
                                                {arrFanpage.filter(item => item.status === "Active").map((item, index) => {
                                                    let isAlreadyFollowed = false;
                                                    item?.followFanpage?.map((user) => {
                                                        if (user.userId === userID) {
                                                            isAlreadyFollowed = user.status;
                                                        }
                                                    });
                                                    return <div className="col-lg-3 col-md-4 col-sm-4" >
                                                        <div className="group-box">
                                                            <NavLink to={`/fanpage/${item.fanpageId}`}>  <figure><img style={{ width: "120px", height: "120px", objectFit: "contain", border: '1px solid black', borderRadius: '50%' }} alt src={item.avatar ==='none' ? './../images/giphy-sample.gif' : item.avatar} /></figure></NavLink>
                                                            <NavLink to={`/fanpage/${item.fanpageId}`}>     <a title href="#">{item.fanpageName}</a></NavLink>
                                                            <span>{item.numberFollow} người theo dõi</span>
                                                            <div
                                                                style={{
                                                                    width: "110px",
                                                                    background: "#088dcd none repeat scroll 0 0",
                                                                    borderRadius: "16px",
                                                                    color: "#fff",
                                                                    display: "block",
                                                                    marginLeft: '60px',
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
                                                        </div>
                                                    </div>
                                                })}


                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <figure className="bottom-mockup"><img src="images/footer.png" alt /></figure>
            <div className="bottombar">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className>© SVCW</span>
                        </div>
                    </div>
                </div>
            </div>{/* bottombar */}



        </Fragment>
    )
}

