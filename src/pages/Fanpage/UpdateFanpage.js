import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useFormik } from "formik";
import React, { useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { storage_bucket } from "../../firebase";
import { useEffect } from "react";
import {
  GetFanpageByIDAction,
  UpdateFanpageAction,
} from "../../redux/actions/FanpageAction";
import { useDispatch } from "react-redux";

export default function UpdateFanpage (props) {
  const dispatch = useDispatch();
  const { update, handleClickUpdate, popupStyleUpdate, fanpageId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgress1, setUploadProgress1] = useState(0);


  const formik = useFormik({
    initialValues: {
      fanpageId: fanpageId?.fanpageId,
      fanpageName: fanpageId?.fanpageName,
      avatar: fanpageId?.avatar,
      coverImage: fanpageId?.coverImage,
      description: fanpageId?.description,
      mst: fanpageId?.mst,
      email: fanpageId?.email,
      phone: fanpageId?.phone,
    },
    enableReinitialize: true,
    onSubmit: async (value) => {

      const action = await UpdateFanpageAction(value, value.fanpageId);
      await dispatch(action);
      handleClickUpdate();
    },
  });
  const uploadFile = (e) => {
    setIsLoading(true);
    let file = e.target.files[0];
    let fileRef = ref(storage_bucket, file.name);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // setShowInput(false);
        setUploadProgress(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {

          // const updatedProduct = { ...product, achivementLogo: url }; // Update achivementLogo property in product object
          // setProduct(updatedProduct);
          formik.setFieldValue("avatar", url);
        });
      }
    );
    setIsLoading(false);
    setUploadProgress(0);
  };
  const uploadFile1 = (e) => {
    setIsLoading1(true);
    let file = e.target.files[0];
    let fileRef = ref(storage_bucket, file.name);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");

        setUploadProgress1(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          formik.setFieldValue("coverImage", url);
        });
      }
    );
    setIsLoading1(false);
    setUploadProgress1(0);
  };
  return (
    <div>
      <form method="post" onSubmit={formik.handleSubmit}>
        {update === true ? (
          <div className="post-new-popup" style={popupStyleUpdate}>
            <div
              className="popup"
              style={{
                width: "65%",
                marginTop: "0px",
                zIndex: 80,

              }}
            >
              <span
                className="popup-closed"
                onClick={() => {
                  handleClickUpdate();
                }}
              >
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
                    Chỉnh sửa tổ chức của bạn
                  </h5>
                </div>
              </div>

              <div
                className=""
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  paddingTop: "50px",
                }}
              >
                <div
                  id="page-contents"
                  className="row"
                  style={{ display: "flex" }}
                >
                  <div className="col-lg-8">
                    <div className="main-wraper">
                      <h4 className="main-title">
                        <i className="icofont-bill" /> Chỉnh sửa tổ chức
                      </h4>
                      <div className="billing">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <input
                              className="uk-input"
                              name="fanpageName"
                              value={formik.values.fanpageName}
                              onChange={formik.handleChange}
                              type="text"
                              placeholder="Tên tổ chức"
                            />
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <input
                              className="uk-input"
                              type="text"
                              name="mst"
                              disabled
                              style={{ background: "rgba(0,0,0,0.1)" }}
                              value={formik.values.mst}
                              onChange={formik.handleChange}
                              placeholder="Nhập Mã Số Thuế"
                            />
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                            <input
                              className="uk-input"
                              type="email"
                              name="email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              placeholder="Nhập Email"
                            />
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                            <input
                              className="uk-input"
                              type="text"
                              name="phone"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                              placeholder="Nhập Số Điện Thoại"
                            />
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                            <textarea
                              className="uk-textarea"
                              name="description"
                              value={formik.values.description}
                              onChange={formik.handleChange}
                              rows={5}
                              placeholder="Nhập Mô Tả"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="main-btn " href="#" title>
                      Chỉnh sửa
                    </button>
                  </div>
                  <div className="col-lg-4">
                    <div
                      className="main-wraper stick-widget"
                      style={{ position: "relative" }}
                    >
                      <div className="cart-summary">
                        <h4 className="main-title">Ảnh Đại Diện</h4>
                        <div
                          className="wrapper"
                          onChange={(e) => uploadFile(e)}
                          style={{ marginLeft: "20px" }}
                        >
                          <div className="file-upload" style={{ width: '220px' }}>
                            <input type="file" />
                            <i className="fa fa-arrow-up" />
                          </div>
                        </div>
                        {isLoading && (
                          <div>
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <div className="progress-percentage">
                              {uploadProgress}%
                            </div>
                          </div>
                        )}
                        {formik.values.avatar !== "" ? (
                          <div
                            style={{ paddingTop: "20px", textAlign: "center" }}
                          >
                            <img
                              src={formik.values.avatar}
                              style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                    <div className="main-wraper stick-widget">
                      <div className="cart-summary">
                        <h4 className="main-title">Ảnh Bìa</h4>
                        <div className="wrapper" style={{ marginLeft: "20px" }}>
                          <div
                            style={{ width: '220px' }}
                            className="file-upload"
                            onChange={(e) => uploadFile1(e)}
                          >
                            <input type="file" />
                            <i className="fa fa-arrow-up" />
                          </div>
                        </div>
                        {isLoading1 && (
                          <div>
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${uploadProgress1}%` }}
                              ></div>
                            </div>
                            <div className="progress-percentage">
                              {uploadProgress1}%
                            </div>
                          </div>
                        )}
                        {formik.values.coverImage !== "" ? (
                          <div
                            style={{ paddingTop: "20px", textAlign: "center" }}
                          >
                            <img
                              src={formik.values.coverImage}
                              style={{ width: "80%", height: "150px" }}
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </form>
    </div>
  );
}
