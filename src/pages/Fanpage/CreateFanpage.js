import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storage_bucket } from "./../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from "react";
import { CreateFanpageAction } from "../../redux/actions/FanpageAction";
import Swal from "sweetalert2";
import * as Yup from "yup";

export default function CreateFanpage (props) {
  const dispatch = useDispatch();
  const { userID } = useSelector((root) => root.LoginReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading1, setIsLoading1] = useState(false);
  const [uploadProgress1, setUploadProgress1] = useState(0);

  const validationSchema = Yup.object({
    fanpageName: Yup.string().required("Tên tổ chức không được bỏ trống"),
    mst: Yup.string()
      .matches(/^\d+$/, "Mã Số Thuế chỉ được nhập số")
      .test(
        "length",
        "Mã Số Thuế phải có độ dài 10 hoặc 13 kí tự",
        (value) => value.length === 10 || value.length === 13
      )
      .required("Mã Số Thuế không được bỏ trống"),
    email: Yup.string()
      .email("Địa chỉ email không hợp lệ")
      .required("Email không được bỏ trống"),
    phone: Yup.string()
      .matches(/^[0-9]*$/, "Số điện thoại chỉ được nhập số")
      .min(10, "Số điện thoại phải có ít nhất 10 kí tự")
      .max(12, "Số điện thoại không vượt quá 12 kí tự")
      .required("Số điện thoại không được bỏ trống"),
    description: Yup.string().required("Mô Tả không được bỏ trống"),
    avatar: Yup.string().required("Vui lòng tải lên ảnh đại diện"),
    coverImage: Yup.string().required("Vui lòng tải lên ảnh bìa"),
  });

  const formik = useFormik({
    initialValues: {
      fanpageName: "",
      avatar: "",
      coverImage: "",
      description: "",
      mst: "",
      email: localStorage.getItem('emailuser'),
      phone: "",
      userId: userID,
    },
    validationSchema: validationSchema,
    onSubmit: (value) => {

      const action = CreateFanpageAction(value, props);
      dispatch(action)
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
        title: `Gửi yêu cầu tạo tổ chức thành công. Chờ admin kiểm duyệt nhé!!!`,
      });
    },
  });
  const [avartar, setAvatar] = useState("");
  useEffect(() => { }, [formik.values.avatar, formik.values.coverImage]);


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
        console.log("Upload is " + progress + "% done");

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
        // setShowInput(false);
        setUploadProgress1(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {

          // const updatedProduct = { ...product, achivementLogo: url }; // Update achivementLogo property in product object
          // setProduct(updatedProduct);
          formik.setFieldValue("coverImage", url);
        });
      }
    );
    setIsLoading1(false);
    setUploadProgress1(0);
  };
  return (
    <div>
      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <form method="post" onSubmit={formik.handleSubmit}>
                <div className="col-lg-12">
                  <div
                    id="page-contents"
                    className="row"
                    style={{ display: "flex" }}
                  >
                    <div className="col-lg-8">
                      <div className="main-wraper">
                        <h4 className="main-title">
                          <i className="icofont-bill" /> Tạo mới tổ chức
                        </h4>
                        <div className="billing">
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                              <input
                                className="uk-input"
                                name="fanpageName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.fanpageName}
                                type="text"
                                placeholder="Tên tổ chức"
                              />
                             
                                <div className="error">
                                  {formik.errors.fanpageName}
                                </div>
                             
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                              <input
                                className="uk-input"
                                name="mst"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.mst}
                                type="text"
                                placeholder="Nhập mã số thuế"
                              />
                             
                                <div className="error">{formik.errors.mst}</div>
                             
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                              <input
                                className="uk-input"
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                type="text"
                                placeholder="Nhập email"
                                disabled
                              />
                            
                                <div className="error">
                                  {formik.errors.email}
                                </div>
                            
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                              <input
                                className="uk-input"
                                name="phone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                                type="text"
                                placeholder="Nhập số điện thoại"
                              />
                           
                                <div className="error">
                                  {formik.errors.phone}
                                </div>
                            
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-4">
                              <textarea
                                className="uk-textarea"
                                name="description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                                rows={5}
                                placeholder="Nhập mô tả"
                              />
                             
                                <div className="error">
                                  {formik.errors.description}
                                </div>
                            
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="main-btn"
                        href="#"
                        title
                       
                      >
                        Tạo tổ chức
                      </button>
                    </div>
                    <div className="col-lg-4">
                      <div
                        className="main-wraper stick-widget"
                        style={{ position: "relative" }}
                      >
                        <div className="cart-summary">
                          <h4 className="main-title">Ảnh đại diện</h4>
                          <div
                            className="wrapper"
                            onChange={(e) => uploadFile(e)}
                          >
                            <div className="file-upload">
                              <input type="file" />
                              <i className="fa fa-arrow-up" />
                            </div>
                          </div>
                          <div className="error">{formik.errors.avatar}</div>
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
                              style={{
                                paddingTop: "20px",
                                textAlign: "center",
                              }}
                            >
                              <img
                                src={formik.values.avatar}
                                style={{
                                  width: "200px",
                                  height: "200px",
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
                          <h4 className="main-title">Ảnh bìa</h4>
                          <div className="wrapper">
                            <div
                              className="file-upload"
                              onChange={(e) => uploadFile1(e)}
                            >
                              <input type="file" />
                              <i className="fa fa-arrow-up" />
                            </div>
                          </div>
                           <div className="error">{formik.errors.coverImage}</div>
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
                              style={{
                                paddingTop: "20px",
                                textAlign: "center",
                              }}
                            >
                              <img
                                src={formik.values.coverImage}
                                style={{ width: "100%", height: "200px" }}
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
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="gap">
          <div
            className="bg-image"
            style={{ backgroundImage: "url(images/resources/footer-bg.png)" }}
          />

        </div>
      </footer>
    </div>
  );
}
