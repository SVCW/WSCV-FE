import { useFormik } from "formik";
import React, { useState } from "react";
import { ResultActivityAction } from "../../redux/actions/ActivityAction";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { storage_bucket } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { NumericFormat } from "react-number-format";

export default function CreateResultActivity (props) {
  const dispatch = useDispatch();
  const { popupStyleCreate, handleClickCreate, idActivity, isOpen } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const formik8 = useFormik({
    initialValues: {
      title: "",
      desciption: "",
      activityId: "",
      totalAmount: 0,
      resultDocument: "string",
      media: [
        // {
        //   "linkMedia": "string",
        //   "type": "string"
        // }
      ]
    },
    onSubmit: async (value) => {
      console.log(value)
      const action = await ResultActivityAction(value);
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
        title: `Thêm kết quả của chiến dịch thành công`,
      });
      handleClickCreate()
      formik8.setFieldValue('title', '')
      formik8.setFieldValue('desciption', '')
      formik8.setFieldValue('activityId', '')
      formik8.setFieldValue('totalAmount', 0)
      formik8.setFieldValue('title', '')
      formik8.setFieldValue('resultDocument', '')
      formik8.setFieldValue('media', [])
    },
  });
  const handleImageChange = async (e) => {
    setIsLoading(true);
    const fileList = e.target.files;

    const newImages = [];

    for (let i = 0;i < fileList.length;i++) {
      const file = fileList[i];
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ file, url: imageUrl });

      try {
        const fileRef = ref(storage_bucket, file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on("state_changed", (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === "success") {
          const downloadURL = await getDownloadURL(snapshot.ref);
          const updatedImages = [...newImages];
          updatedImages[i].url = downloadURL;

          setImages([...images, ...updatedImages]);
          const img = [...images, ...updatedImages].map((item, index) => {
            const images = {
              type: "string",
              linkMedia: item.url,
            };
            return images;
          });
          formik8.setFieldValue("media", img);
        }
      } catch (error) { }
    }
    setIsLoading(false);
    setUploadProgress(0);
  };
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  useEffect(() => {
    if (idActivity) {
      formik8.setFieldValue("activityId", idActivity);
    }
  }, [idActivity]);
  return (
    <div>
      {isOpen === true ? (
        <div className="post-new-popup" style={popupStyleCreate}>
          <div className="popup" style={{ width: 800, zIndex: 80, marginTop: '100px' }}>
            <span className="popup-closed" onClick={handleClickCreate}>
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
                  Cập nhật kết quả
                </h5>
              </div>
            </div>

            <div style={{ padding: '40px 0' }}>
              <form onSubmit={formik8.handleSubmit}>
                <div className="form row mt-3">

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tiêu đề</label>
                        <input
                          className="form-control"
                          name="title"
                          onChange={formik8.handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tổng tiền</label>

                        <NumericFormat
                          placeholder="Nhập số tiền"
                          className="form-control"
                          name="amount"
                          onChange={formik8.handleChange}
                          value=""
                          allowLeadingZeros
                          thousandSeparator=","
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Chi tiết</label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="2"
                      cols="50"
                      name="desciption"
                      onChange={formik8.handleChange}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Hình ảnh</label>
                        <div>
                          <form>
                            <fieldset className="upload_dropZone text-center mb-3 p-4">
                              <legend className="visually-hidden">
                                Tải hình ảnh
                              </legend>
                              <svg
                                className="upload_svg"
                                width={60}
                                height={60}
                                aria-hidden="true"
                              >
                                <use href="#icon-imageUpload" />
                              </svg>
                              <p className="small my-2">
                                Kéo &amp; Thả (các) hình nền bên trong vùng nét
                                đứt
                                <br />
                                <i>hoặc</i>
                              </p>
                              <input
                                id="upload_image_background"
                                // ref={fileInputRef}
                                data-post-name="image_background"
                                data-post-url="https://someplace.com/image/uploads/backgrounds/"
                                className="position-absolute invisible"
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/svg+xml"
                              />
                              <label
                                className="btn btn-upload mb-3"
                                htmlFor="upload_image_background"
                              >
                                Chọn hình ảnh
                              </label>
                              <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                            </fieldset>
                          </form>
                          <svg style={{ display: 'none' }}>
                            <defs>
                              <symbol
                                id="icon-imageUpload"
                                clipRule="evenodd"
                                viewBox="0 0 96 96"
                              >
                                <path d="M47 6a21 21 0 0 0-12.3 3.8c-2.7 2.1-4.4 5-4.7 7.1-5.8 1.2-10.3 5.6-10.3 10.6 0 6 5.8 11 13 11h12.6V22.7l-7.1 6.8c-.4.3-.9.5-1.4.5-1 0-2-.8-2-1.7 0-.4.3-.9.6-1.2l10.3-8.8c.3-.4.8-.6 1.3-.6.6 0 1 .2 1.4.6l10.2 8.8c.4.3.6.8.6 1.2 0 1-.9 1.7-2 1.7-.5 0-1-.2-1.3-.5l-7.2-6.8v15.6h14.4c6.1 0 11.2-4.1 11.2-9.4 0-5-4-8.8-9.5-9.4C63.8 11.8 56 5.8 47 6Zm-1.7 42.7V38.4h3.4v10.3c0 .8-.7 1.5-1.7 1.5s-1.7-.7-1.7-1.5Z M27 49c-4 0-7 2-7 6v29c0 3 3 6 6 6h42c3 0 6-3 6-6V55c0-4-3-6-7-6H28Zm41 3c1 0 3 1 3 3v19l-13-6a2 2 0 0 0-2 0L44 79l-10-5a2 2 0 0 0-2 0l-9 7V55c0-2 2-3 4-3h41Z M40 62c0 2-2 4-5 4s-5-2-5-4 2-4 5-4 5 2 5 4Z" />
                              </symbol>
                            </defs>
                          </svg>
                        </div>

                        <div className="image-container image-container-flex1">
                          {images.map((image, index) => (
                            <div
                              className="image-item image-item-relative"
                              key={index}
                              style={{ height: '30px!important' }}
                            >
                              <img
                                src={image.url}
                                alt={`Image ${index}`}
                                className="image-preview1 image-item-flex1"
                                style={{ height: '100px!important', width: '100px!important' }}
                              />
                              <button
                                className="delete-button"
                                onClick={() => handleImageDelete(index)}
                              >
                                <span>&times;</span>
                              </button>
                            </div>
                          ))}
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

                        {files !== '' ? (
                          <img src={files} style={{ height: '300px' }} />
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{}}>
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Cập nhật
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
