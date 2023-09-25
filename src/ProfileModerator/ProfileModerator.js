import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { GetListModeratorIdAction } from "../redux/actions/ModeratorAction";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage_bucket } from "../firebase";
import { useFormik } from "formik";

export default function ProfileModerator(props) {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const [isEditing, setIsEditing] = useState(false);
  const popupStyle9 = {
    opacity: isEditing ? 1 : 0,
    visibility: isEditing ? "visible" : "hidden",
    overflow: isEditing ? "auto" : "hidden",
  };
  const openPopup = () => {
    setIsEditing((prevIsOpen) => !prevIsOpen)
   
  };
  const { ModeratorId } = useSelector((root) => root.LoginReducer);

  useEffect(() => {
    const action = GetListModeratorIdAction(id);
    dispatch(action);
  }, []);

const formik6 = useFormik({
    initialValues:{
        userId:ModeratorId?.userId,
        password: ModeratorId?.password,
        image: ModeratorId?.image,
        gender: true,
        fullName: ModeratorId?.fullName,
        coverImage: ModeratorId?.coverImage,
        dateOfBirth: ModeratorId?.dateOfBirth
    },
    onSubmit :(value) =>{
        console.log(value)
    }
})
 
  return (
    <div>
      <div className="theme-layout" style={{ marginLeft: "200px" }}>
        <section>
          <div className="gap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div id="page-contents" className="row merged20">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-9">
                      <div className="group-feed">
                        <div className="group-avatar">
                          <img src="../images/back.jpg" />
                          <figure className="group-dp">
                            <img src="../images/avatar.jpg" />
                          </figure>
                        </div>
                        <div className="grp-info about">
                          <h4>
                         { ModeratorId?.username}
                            <span>@{ModeratorId?.fullName}</span>
                          </h4>
                          <ul className="joined-info">
                            <li>
                              <span>Ngày tạo tài khoản:</span>{" "}
                              {moment(ModeratorId?.createAt).format("DD/MM/YYYY")}
                        
                            </li>
                           
                          </ul>
                        </div>
                       <div style={{background:'white' , padding:'30px 30px' , borderRadius:'10px'}}>
                       <div style={{display:'flex', justifyContent:'space-between' , marginBottom:'40px',     border: "transparent", background: "none"}}>
                       <h4 style={{fontWeight:700}}>Thông tin </h4>
                       <button>Chỉnh sửa</button>
                       </div>
                        <form class="row ">
                          <div class="col-md-6">
                            <label for="validationDefault01" class="form-label" style={{fontWeight:700}}>
                              Tài khoản
                            </label>
                            <input
                              type="text"
                              class="form-control-plaintext"
                              id="validationDefault01"
                              value={ModeratorId?.username}
                              readOnly
                            />
                          </div>
                          <div class="col-md-6">
                            <label for="validationDefault02" class="form-label" style={{fontWeight:700}}>
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              class="form-control-plaintext"
                              id="validationDefault02"
                              value={ModeratorId?.fullName}
                              readOnly
                            />
                          </div>
                        
                          <div class="col-md-6">
                            <label for="validationDefault02" class="form-label" style={{fontWeight:700}}>
                              Email
                            </label>
                            <input
                              type="text"
                              class="form-control-plaintext"
                              id="validationDefault02"
                              value={ModeratorId?.email}
                              readOnly
                            />
                          </div>
                          <div class="col-md-6">
                            <label for="validationDefault02" class="form-label" style={{fontWeight:700}}>
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              class="form-control-plaintext"
                              id="validationDefault02"
                              value={ModeratorId?.phone}
                              readOnly
                            />
                          </div>
                          <div class="col-md-6">
                            <label for="validationDefault02" class="form-label" style={{fontWeight:700}}>
                              Sinh nhật
                            </label>
                            <input
                              type="text"
                              class="form-control-plaintext"
                              id="validationDefault02"
                              value={moment(ModeratorId?.dateOfBirth).format(
                                "DD/MM/YYYY"
                              )}
                              readOnly
                            />
                          </div>
                         
                         
                        </form>
                       </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isEditing ? (
                <div className="post-new-popup1" style={popupStyle9}>
                    <div
                        className="popup"
                        style={{
                            width: 600,
                            zIndex: 80,
                            height: 450,
                            // overflowY: "scroll",
                            padding: '10px',
                            marginTop: '-100px',
                        }}
                    >
                        <span className="popup-closed" onClick={openPopup}>
                            <i className="icofont-close" />
                        </span>
                        <div className="popup-meta">
                            <div className="popup-head">
                                <h5>
                                    <i>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-plus"
                                        >
                                            <line x1={12} y1={5} x2={12} y2={19} />
                                            <line x1={5} y1={12} x2={19} y2={12} />
                                        </svg>
                                    </i>
                                    Báo cáo bài viết
                                </h5>
                            </div>
                        </div>
                        <div>
                            <form onSubmit={formik6.handleSubmit}>
                                <div className="form row mt-3">
                                   
                                    <div className="form-group">
                                        <label>Lý do</label>
                                        <textarea
                                            id="message"
                                            className="form-control"
                                            rows="2"
                                            cols="50"
                                            name="reason"
                                            onChange={formik6.handleChange}
                                        ></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block"
                                            >
                                                Báo cáo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
    </div>
  );
}
