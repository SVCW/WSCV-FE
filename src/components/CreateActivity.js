import { useFormik } from "formik";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateActivityAction } from "../redux/actions/ActivityAction";
import Swal from "sweetalert2";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import GoogleMapReact from "google-map-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage_bucket } from "../firebase";
import { useEffect } from "react";
import { GetUserByIdAction } from "../redux/actions/UserAction";
import moment from "moment";
import { GetListProcessTypeAction } from "../redux/actions/ProcessTypeAction";
import { CreateProcessAction } from "../redux/actions/ProcessAction";
import * as Yup from "yup";
const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default function CreateActivity() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isDisplay, setIsDisplay] = useState(true);
  const [images, setImages] = useState([]);
  const [coords, setCoords] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState("");
  const { configActivity, isValidCreate, isFanpage } = useSelector(
    (root) => root.ConfigActivityReducer
  );

  const { userID } = useSelector((root) => root.LoginReducer);
  const { getUserId } = useSelector((root) => root.ProfileReducer);
  const [currentForm, setCurrentForm] = useState(0);
  const [isTextInputVisible, setTextInputVisible] = useState(false);
  const [isTextInputVisible1, setTextInputVisible1] = useState(isFanpage);
  const { processType, activityProcess } = useSelector(
    (root) => root.ProcessTypeReducer
  );
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [tt, setTT] = useState(false);
  const popupStyle9 = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    overflow: isOpen ? "auto" : "hidden",
  };
  const popupStyle10 = {
    opacity: isOpen1 ? 1 : 0,
    visibility: isOpen1 ? "visible" : "hidden",
    overflow: isOpen1 ? "auto" : "hidden",
    zIndex: 300,
  };
  const toggleTextInput1 = () => {
    setTextInputVisible1(!isTextInputVisible1);
    formik.setFieldValue("isFanpageAvtivity", isTextInputVisible1);
  };
  const fn = async (value) => {
    const result = await geocodeByAddress(value);
    const lnglat = await getLatLng(result[0]);

    setCoords(lnglat);
  };
  const handleImageChange = async (e) => {
    setIsLoading(true);
    const fileList = e.target.files;

    const newImages = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ file, url: imageUrl });

      try {
        const fileRef = ref(storage_bucket, file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on("state_changed", (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const integerProgress = Math.floor(progress);

          setUploadProgress(integerProgress);
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
          formik.setFieldValue("media", img);
        }
      } catch (error) {}
    }
    setIsLoading(false);
    setUploadProgress(0);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Tên chiến dịch không được bỏ trống"),
    description: Yup.string().required("Mô tả chiến dịch không được bỏ trống"),
    startDate: Yup.string().required("Ngày bắt đầu không được bỏ trống"),
    endDate: Yup.string().required("Ngày kết thúc không được bỏ trống"),
    location: Yup.string().required("Đối tượng không được bỏ trống"),
    media: Yup.array()
      .required("Vui lòng tải lên hình ảnh")
      .test(
        "isNotEmpty",
        "Vui lòng tải lên ít nhất một hình ảnh",
        (value) => value && value.length > 0
      ),
  });
  const [create, setCreate] = useState(activityProcess);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      targetDonation: 0,
      userId: userID,
      isFanpageAvtivity: false,
      media: [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (value) => {
      const action = await CreateActivityAction(value, setCreate);
      await dispatch(action);
      formik.setFieldValue("title", "");
      formik.setFieldValue("description", "");
      formik.setFieldValue("location", "");
      formik.setFieldValue("targetDonation", 0);
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
      formik.setFieldValue("endactivity", "");
      formik.setFieldValue("isFanpageAvtivity", false);
      formik.setFieldValue("media", []);

      Swal.fire({
        title: "Thành công",
        text: "Chiến dịch của bạn đã được ghi nhận. Vui lòng chờ được kiểm duyệt bởi hệ thống SVCW nhé!",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Hoàn thành",
      });
      setIsOpen((prevIsOpen) => !prevIsOpen);
      setIsDisplay(false);
    },
  });

  const process = processType?.map((item, index) => {
    return {
      id: item.processTypeId,
      value: item.processTypeName,
    };
  });
  const [inputFields, setInputFields] = useState([
    {
      processTitle: "",
      description: "",
      startDate: "",
      endDate: "",
      activityId: create,
      processTypeId: "",
      isKeyProcess: true,
      processNo: 0,
      location: "online",
      targetParticipant: 0,
      realParticipant: 0,
      isDonateProcess: false,
      isParticipant: false,
      realDonation: 0,
      targetDonation: 0,
      meida: [],
      media: [],
    },
  ]);
  const [tit, setTit] = useState("");
  console.log(tit)
  const addInputField = () => {
    if (error === "1") {
      setInputFields([
        ...inputFields,
        {
          processTitle: "",
          description: "",
          startDate: "",
          endDate: "",
          activityId: create,
          processTypeId: "",
          isKeyProcess: true,
          processNo: 0,
          location: "online",
          targetParticipant: 0,
          realParticipant: 0,
          isDonateProcess: false,
          isParticipant: false,
          realDonation: 0,
          targetDonation: 0,
          meida: [],
          media: [],
        },
      ]);
    } else {
      Swal.fire({
        title: "Cảnh báo",
        text: "Vui lòng điền thông tin đầy đủ và phù hợp",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Hoàn thành",
        zIndex: 999,
      });
    }
  };
  const removeInputField = (index) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields.splice(index, 1);
    setInputFields(updatedInputFields);
  };
  const [error, setError] = useState("1");
  const handleInputChange = (index, field, value) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields[index][field] = value;
    if (updatedInputFields[index].processTypeId === "pt002") {
      updatedInputFields[index].targetDonation = 0;
      updatedInputFields[index].isDonateProcess = false;
      updatedInputFields[index].isParticipant = true;
    } else if (updatedInputFields[index].processTypeId === "pt001") {
      updatedInputFields[index].targetParticipant = 0;
      updatedInputFields[index].isDonateProcess = true;
      updatedInputFields[index].isParticipant = false;
    } else if (
      moment(localStorage.getItem("startactivity")).isAfter(
        updatedInputFields[index].startDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày bắt đầu hoạt động không bé hơn ngày bắt đầu tạo chiến dịch! ${moment(
          localStorage.getItem("startactivity")
        ).format("DD/MM/YYYY")}`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (
      moment(localStorage.getItem("endstart")).isBefore(
        updatedInputFields[index].startDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày bắt đầu hoạt động không lớn hơn ngày kết thúc chiến dịch! ${moment(
          localStorage.getItem("endstart")
        ).format("DD/MM/YYYY")}`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (
      moment(localStorage.getItem("endstart")).isBefore(
        updatedInputFields[index].endDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày kết thúc hoạt động không lớn hơn ngày kết thúc chiến dịch! ${moment(
          localStorage.getItem("endstart")
        ).format("DD/MM/YYYY")}`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (
      moment(localStorage.getItem("startactivity")).isAfter(
        updatedInputFields[index].endDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày kết thúc hoạt động không bé hơn ngày bắt đầu chiến dịch! ${moment(
          localStorage.getItem("startactivity")
        ).format("DD/MM/YYYY")}`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (parseFloat(updatedInputFields[index].targetDonation) > 100) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Số tiền tối đa bạn có thể tạo cho chiến dịch là ${Number(
          localStorage.getItem("maxDonate")
        )}`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (
      moment(updatedInputFields[index].endDate).isBefore(
        updatedInputFields[index].startDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày kết thúc không trước ngày bắt đầu hoạt động`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (
      moment(updatedInputFields[index].startDate).isAfter(
        updatedInputFields[index].endDate
      )
    ) {
      Swal.fire({
        title: "Cảnh báo",
        text: `Ngày bắt đầu không sau ngày kết thúc hoạt động`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đồng ý",
        zIndex: 999,
      });
      setError("2");
    } else if (updatedInputFields[index].processTitle === "") {
      setTit("Vui lònng không bỏ trống");
    } else {
       setTit("");
      setError("1");
    }

    updatedInputFields[index].processNo = index + 1;
    setInputFields(updatedInputFields);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (error === "1") {
      const text = inputFields.map((item, index) => {
        return {
          processTitle: item.processTitle,
          description: item.description,
          startDate: item.startDate,
          endDate: item.endDate,
          activityId: create,
          processTypeId: item.processTypeId,
          isKeyProcess: true,
          processNo: item.processNo,
          location: item.location,
          targetParticipant: item.targetParticipant,
          realParticipant: item.realParticipant,
          isDonateProcess: item.isDonateProcess,
          isParticipant: item.isParticipant,
          realDonation: item.realDonation,
          targetDonation: item.targetDonation,
          meida: item.meida,
          media: item.media,
        };
      });
      console.log(text)
      // const action1 = await CreateProcessAction(text, handleClick1);
      // dispatch(action1);
      setInputFields([
        {
          processTitle: "",
          description: "",
          startDate: "",
          endDate: "",
          activityId: create,
          processTypeId: "",
          isKeyProcess: true,
          processNo: 0,
          location: "online",
          targetParticipant: 0,
          realParticipant: 0,
          isDonateProcess: false,
          isParticipant: false,
          realDonation: 0,
          targetDonation: 0,
          meida: [],
          media: [],
        },
      ]);
    } else {
      Swal.fire({
        title: "Cảnh báo",
        text: "Vui lòng điền thông tin đầy đủ và phù hợp",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Hoàn thành",
        zIndex: 999,
      });
    }
  };
  const handleClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setIsDisplay(true);
    formik.setFieldValue("title", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("location", "");
    formik.setFieldValue("targetDonation", 0);
    formik.setFieldValue("startDate", "");
    formik.setFieldValue("endDate", "");
    formik.setFieldValue("endactivity", "");
    formik.setFieldValue("isFanpageAvtivity", false);
    formik.setFieldValue("media", []);
  };
  const handleClick1 = () => {
    setIsOpen1((prevIsOpen) => !prevIsOpen);
  };
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  const [imageUrls1, setImageUrls1] = useState([]);
  const handleImageChange1 = async (index, event) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields[index].images = event.target.files;
    setInputFields(updatedInputFields); // Update the inputFields with selected images

    const uploadedImageUrls = [];

    for (const image of updatedInputFields[index].images) {
      const fileRef = ref(storage_bucket, image.name);
      const uploadTask = uploadBytesResumable(fileRef, image);

      await uploadTask;

      const downloadURL = await getDownloadURL(fileRef);
      uploadedImageUrls.push(downloadURL);
    }

    updatedInputFields[index].meida = uploadedImageUrls;
    const img = uploadedImageUrls.map((item, index) => {
      return {
        linkMedia: item,
        type: "string",
      };
    });
    updatedInputFields[index].media = img;
    setInputFields(updatedInputFields); // Update the inputFields with image URLs
    await setImageUrls1((prevImageUrls) => {
      const newImageUrls = [...prevImageUrls];
      newImageUrls[index] = uploadedImageUrls;
      return newImageUrls;
    });
  };

  useEffect(() => {
    const user = localStorage.getItem("userID");
    if (user) {
      const action = GetUserByIdAction(user);
      dispatch(action);
    }
  }, [create]);
  return (
    <div>
      {isValidCreate === "true" ? (
        <div
          className="main-wraper"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <span className="new-title">Bạn muốn tạo chiến dịch mới</span>
          <div className="new-post">
            <form method="post" onClick={handleClick}>
              <i className="icofont-pen-alt-1" />
              <input
                onClick={handleClick}
                type="text"
                placeholder="Tạo chiến dịch"
              />
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {isOpen === true ? (
        <div className="post-new-popup" style={popupStyle9}>
          <div
            className="popupPost"
            style={{
              width: 800,
              height: "90vh",
              overflowY: "scroll",
              margin: "1rem",
            }}
          >
            <span className="popup-closed" onClick={handleClick}>
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
                  Tạo chiến dịch
                </h5>
              </div>
            </div>

            <div className="">
              <br />
              <form
                id="survey-form"
                method="post"
                onSubmit={formik.handleSubmit}
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Tên chiến dịch
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        id="name"
                        placeholder="Nhập tên chiến dịch"
                        className="form-control"
                      />
                      <div className="error">{formik.errors.title}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="email-label" htmlFor="email">
                        Mô tả chiến dịch
                      </label>
                      <textarea
                        id="message"
                        className="form-control"
                        rows="2"
                        cols="50"
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                      ></textarea>

                      <div className="error">{formik.errors.description}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Ngày bắt đầu
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        onChange={formik.handleChange}
                        value={formik.values.startDate}
                        id="name"
                        className="form-control"
                        min={new Date().toISOString().split("T")[0]}
                        max={moment(formik.values.endDate).format("YYYY-MM-DD")}
                      />
                      <div className="error">{formik.errors.startDate}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        onChange={formik.handleChange}
                        value={formik.values.endDate}
                        id="name"
                        className="form-control"
                        min={
                          moment(formik.values.startDate).format(
                            "YYYY-MM-DD"
                          ) && new Date().toISOString().split("T")[0]
                        }
                      />
                      <div className="error">{formik.errors.endDate}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Đối tượng hỗ trợ
                      </label>

                      <textarea
                        id="message"
                        className="form-control"
                        rows="2"
                        cols="50"
                        name="location"
                        onChange={formik.handleChange}
                        value={formik.values.location}
                      ></textarea>
                      <div className="error">{formik.errors.location}</div>
                      {/* <input
                        type="text"
                        name="location"
                        onChange={(e) => {
                          formik.handleChange(e);
                          // fn(e.target.value);
                        }}
                        value={formik.values.location}
                        id="name"
                        placeholder=" Đối tượng hỗ trợ"
                        className="form-control"

                      /> */}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      {getUserId?.fanpage?.status === "Active" && isFanpage ? (
                        <div className="form-group" style={{ display: "flex" }}>
                          <label
                            id="name-label"
                            style={{ marginRight: "20px" }}
                            htmlFor="name"
                          >
                            Chia sẻ lên tổ chức của bạn
                          </label>
                          <input
                            type="checkbox"
                            onChange={toggleTextInput1}
                            // checked={isTextInputVisible1}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
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
                          <div className="error">{formik.errors.media}</div>
                        </form>
                        <svg style={{ display: "none" }}>
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

                      <div className="image-container image-container-flex">
                        {formik.values.media.length === 0 ? (
                          <div></div>
                        ) : (
                          <Fragment>
                            {images.map((image, index) => (
                              <div
                                className="image-item image-item-relative"
                                key={index}
                              >
                                <img
                                  src={image.url}
                                  alt={`Image ${index}`}
                                  className="image-preview image-item-flex"
                                />
                                <button
                                  className="delete-button"
                                  onClick={() => handleImageDelete(index)}
                                >
                                  <span>&times;</span>
                                </button>
                              </div>
                            ))}
                          </Fragment>
                        )}
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

                      {files !== "" ? (
                        <img src={files} style={{ height: "300px" }} />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <button
                      type="submit"
                      id="submit"
                      className="btn btn-primary btn-block"
                    >
                      Hoàn thành
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      className="btn btn-success btn-block"
                      onClick={async () => {
                        if (formik.values.location !== "") {
                          const action = await CreateActivityAction(
                            formik.values,
                            setCreate
                          );
                          dispatch(action);
                          setIsOpen((prevIsOpen) => !prevIsOpen);
                          setIsDisplay(false);
                          setIsOpen1((prevIsOpen) => !prevIsOpen);
                        } else {
                          setIsOpen((prevIsOpen) => !prevIsOpen);
                          Swal.fire({
                            title: "Cảnh báo",
                            text: "Vui lòng nhập đầy đủ thông tin tạo chiến dịch",
                            icon: "warning",
                            showCancelButton: false, // Set this to false to hide the cancel button
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Đồng ý",
                            zIndex: 999,
                          });
                        }
                      }}
                    >
                      Thêm hoạt động
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {isOpen1 === true ? (
        <div className="post-new-popup" style={popupStyle10}>
          <div
            className="popupPost"
            style={{
              width: 800,
              zIndex: 80,
              height: "100vh",
              overflowY: "scroll",
              margin: "1rem",
            }}
          >
            <span className="popup-closed" onClick={handleClick1}>
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
                  Thêm hoạt động
                </h5>
              </div>
            </div>

            <div className="">
              <br />

              <div
                style={{
                  textAlign: "center",
                  margin: "40px 0",
                  fontSize: "25px",
                }}
              >
                Tên chiến dịch:
                <span style={{ fontWeight: "bold", paddingLeft: "5px" }}>
                  {formik.values.title}
                </span>
              </div>

              <div className="container">
                <form onSubmit={handleSubmit}>
                  {inputFields?.map((data, index) => (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                          Hoạt động {index + 1}
                        </div>
                        <div className="">
                          {inputFields.length !== 1 && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => removeInputField(index)}
                            >
                              x
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="row" key={index}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label id="name-label" htmlFor="name">
                                Tên hoạt động
                              </label>
                              <input
                                type="text"
                                value={data.processTitle}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "processTitle",
                                    event.target.value
                                  )
                                }
                                className="form-control"
                                placeholder="Tên hoạt động"
                                required
                              />
                              <div> {tit ==="" ? <Fragment></Fragment>: tit}</div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label id="name-label" htmlFor="name">
                                Chi tiết hoạt động
                              </label>
                              <textarea
                                rows="2"
                                cols="50"
                                value={data.description}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "description",
                                    event.target.value
                                  )
                                }
                                className="form-control"
                                placeholder="Chi tiết"
                                required
                              ></textarea>
                              {/* <input
                                type="text"
                                value={data.description}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "description",
                                    event.target.value
                                  )
                                }
                                className="form-control"
                                placeholder="Chi tiết"
                                required
                              /> */}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label id="name-label" htmlFor="name">
                                Ngày bắt đầu
                              </label>
                              <input
                                type="datetime-local"
                                name="startDate"
                                value={data.startDate}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "startDate",
                                    event.target.value
                                  )
                                }
                                id="name"
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label id="name-label" htmlFor="name">
                                Ngày kết thúc
                              </label>
                              <input
                                type="datetime-local"
                                name="endDate"
                                value={data.endDate}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "endDate",
                                    event.target.value
                                  )
                                }
                                id="name"
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label
                              id="name-label"
                              htmlFor="name"
                              style={{
                                fontSize: "18px",
                                color: "#000",
                              }}
                            >
                              Loại hoạt động
                            </label>
                            <select
                              className="form-control"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "processTypeId",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <option value="">Chọn loại</option>
                              {process?.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.value}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label id="name-label" htmlFor="name">
                                Địa điểm
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={data.location}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    "location",
                                    event.target.value
                                  )
                                }
                                id="name"
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            {data.processTypeId === "pt002" ? (
                              <div className="form-group mt-3">
                                <label id="name-label" htmlFor="name">
                                  Số người tham gia
                                </label>
                                <input
                                  type=""
                                  min={0}
                                  name="targetParticipant"
                                  value={formatNumberWithCommas(data.targetParticipant)}
                                  
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "targetParticipant",
                                      Number(event.target.value.replace(/\D/, ""))
                                    )
                                  }
                                  id="name"
                                  className="form-control"
                                  required
                                />
                              </div>
                            ) : data.processTypeId === "pt001" ? (
                              <div className="form-group mt-3">
                                <label id="name-label" htmlFor="name">
                                  Số tiền ủng hộ
                                </label>
                                <input
                                  type=""
                                  min={0}
                                  name="targetDonation"
                                  value={formatNumberWithCommas(data.targetDonation)}
                                  onChange={(event) => {
                                    if (
                                      Number(event.target.value) >
                                      Number(localStorage.getItem("maxDonate"))
                                    ) {
                                      Swal.fire({
                                        title: "Cảnh báo",
                                        text: `Số tiền lớn hơn số tiền tối đa bạn có thể tạo cho chiến dịch! ${Number(
                                          localStorage.getItem("maxDonate")
                                        )?.toLocaleString()} vnđ`,
                                        icon: "warning",
                                        showCancelButton: false,
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "Đồng ý",
                                        zIndex: 999,
                                      });
                                      setError("2");
                                    } else {
                                      handleInputChange(
                                      index,
                                      "targetDonation",
                                      Number(event.target.value.replace(/\D/, ""))
                                    )
                                    
                                      setError("1");
                                    }
                                  }}
                                  id="name"
                                  className="form-control"
                                  required
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <div className="form-group">
                              <input
                                type="file"
                                onChange={(event) =>
                                  handleImageChange1(index, event)
                                }
                                multiple
                                required
                              />
                              <div>
                                <div className="image-container image-container-flex">
                                  {data?.meida?.map((image, index) => (
                                    <div
                                      className="image-item image-item-relative"
                                      key={index}
                                    >
                                      <img
                                        src={image}
                                        alt={`Image ${index}`}
                                        className="image-preview image-item-flex"
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="row">
                    <div className="col-sm-12">
                      <button
                        type="button"
                        className="btn btn-success mr-4"
                        onClick={addInputField}
                      >
                        Thêm mới
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Hoàn thành
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
