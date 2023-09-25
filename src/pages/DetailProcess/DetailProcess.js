import React from "react";
import {
  CreateProcess1Action,
  CreateProcessAction,
  DeleteProcessByIdAction,
  GetProcessByActivityAction,
  UpdateProcessAction,
} from "../../redux/actions/ProcessAction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import Slider from "react-slick";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useFormik } from "formik";
import { GetListProcessTypeAction } from "../../redux/actions/ProcessTypeAction";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage_bucket } from "../../firebase";
import Swal from "sweetalert2";
export default function DetailProcess (props) {
  const [settings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  const currentTime = moment();
  const [typeProcess, setType] = useState('')
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const { processactivity, processType } = useSelector(
    (root) => root.ProcessTypeReducer
  );
  const process = processType?.map((item, index) => {
    return {
      id: item.processTypeId,
      value: item.processTypeName
    }
  })
  useEffect(() => {
    const action = GetProcessByActivityAction(id);
    dispatch(action);
    const action1 = GetListProcessTypeAction();
    dispatch(action1);
  }, []);

  const DateTime = (value) => {
    const currentTime = moment(value).format("DD/MM/YYYY hh:mm A");
    return currentTime;
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, processactivity.length - 1)
    );
  };

  const [create, setCreate] = useState(true);
  const currentObject = processactivity[currentIndex];
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const popupStyle = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    overflow: isOpen ? "auto" : "hidden",
    zIndex: 200
  };
  const [images, setImages] = useState([]);
  const [isOpen1, setIsOpen1] = useState(false);
  const [files, setFiles] = useState("");
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
          setImages((prevImages) => [...prevImages, ...updatedImages]);
        }
      } catch (error) {
        console.log(error);
      }
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
  const popupStyle1 = {
    opacity: isOpen1 ? 1 : 0,
    visibility: isOpen1 ? "visible" : "hidden",
    overflow: isOpen1 ? "auto" : "hidden",
    zIndex: 200
  };
  const handleClick1 = () => {
    setIsOpen1((prevIsOpen) => !prevIsOpen);
    formik1.setFieldValue('processTitle', '')
  };
  const handleClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const formik = useFormik({
    initialValues: {
      processId: currentObject?.processId,
      processTitle: currentObject?.processTitle,
      description: currentObject?.description,
      startDate: currentObject?.startDate,
      endDate: currentObject?.endDate,
      processTypeId: currentObject?.processTypeId,
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      if (moment(value.startDate).isBefore(currentObject.activity?.startDate)) {
        Swal.fire({
          title: 'Cảnh báo',
          text: `Ngày bắt đầu hoạt động không bé hơn ngày bắt đầu tạo chiến dịch! ${moment(currentObject.activity?.startDate).format('DD/MM/YYYY')}`,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Chỉnh sửa',
          zIndex: 999
        })
      } else if (moment(value.endDate).isAfter(currentObject.activity?.endDate)) {
        Swal.fire({
          title: 'Cảnh báo',
          text: `Ngày kết thúc hoạt động không lớn hơn ngày kết thúc chiến dịch! ${moment(currentObject.activity?.endDate).format('DD/MM/YYYY')}`,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Chỉnh sửa',
          zIndex: 999
        })
      }


      else {

        const action = await UpdateProcessAction(value);
        await dispatch(action);
        const action1 = GetProcessByActivityAction(id);
        dispatch(action1);
        handleClick();
      }
    },
  });

  const formik1 = useFormik({
    initialValues: {
      processTitle: "",
      description: "",
      startDate: "",
      endDate: "",
      activityId: id,
      processTypeId: "",
      isKeyProcess: true,
      processNo: processactivity.length + 1,
      location: "online",
      targetParticipant: 0,
      realParticipant: 0,
      isDonateProcess: true,
      isParticipant: true,
      realDonation: 0,
      targetDonation: 0,
      media: [],
    },
    onSubmit: async (value) => {

      const action = await CreateProcess1Action(value, id);
      await dispatch(action);
      setIsOpen1((prevIsOpen) => !prevIsOpen);
    },
  });

  useEffect(() => {
    const arrMedia = images.map((image) => ({
      linkMedia: image.url,
      type: "string",
    }));
    formik1.setFieldValue("media", arrMedia);

  }, [images]);

  const DeleteProcess = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Bạn đã chắc chắn?",
        text: "Bạn muốn xóa hoạt động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng Ý!",
        cancelButtonText: "Hủy bỏ!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const action = await DeleteProcessByIdAction(currentObject.processId);
          await dispatch(action);
          setCurrentIndex((prevIndex) =>
            Math.min(prevIndex + 1, processactivity.length - 1)
          );
          const action1 = GetProcessByActivityAction(id);
          dispatch(action1);

          swalWithBootstrapButtons.fire(
            "Xóa!",
            "Xóa thành công hoạt động.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Hủy bỏ",
            "Hủy bỏ xóa hoạt động",
            "error"
          );
        }
      });
  };
  return (
    <div>
      <section>
        <div className="gap">
          <div className="container">
            <div
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                // to="/home"
                className="blog-title"

              >
                <div
                  style={{
                    color: "#00a6d3",


                  }}
                >
                  <div className="pre" title>
                    {/* <i
                      className="icofont-curved-double-left"
                      style={{ fontSize: "23px", paddingTop: "5px" }}
                    /> */}
                  </div>
                  {/* <h4
                    style={{ position: "absolute", left: "28px", top: "-3px" }}
                  >
                    Trang chủ
                  </h4> */}
                  <div style={{display:'flex', justifyContent:'center', width:"100%"}}>
                  {/* <p style={{ fontSize: '25px', marginLeft: '100px', color: 'rgb(0, 166, 211)' , marginTop:'12px' }}>Hoạt động: {currentObject?.processNo + 1}</p> */}
                  <h2 style={{ color: '#00a6d3', textAlign: 'center', fontSize: '40px', fontWeight: 800 ,width:'50%' }}>{currentObject?.activity?.title}</h2>
                  </div>
                 
                </div>
              </div>
              {/* <div className="more">
                <div className="more-post-optns">
                  <i className>
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
                      className="feather feather-more-horizontal"
                    >
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </i>
                  <ul>
                    <li onClick={handleClick1}>
                      <i className="icofont-pen-alt-1" />
                      Thêm mới
                      <span>Thêm mới hoạt động</span>
                    </li>
                    <li onClick={handleClick}>
                      <i className="icofont-pen-alt-1" />
                      Chỉnh sửa
                      <span>Chỉnh sửa hoạt động</span>
                    </li>
                    <li
                      onClick={() => {
                        DeleteProcess(currentObject.processId);
                      }}
                    >
                      <i className="icofont-ban" />
                      Xóa
                      <span>Xóa hoạt động</span>
                    </li>
                  </ul>
                </div>
              </div> */}
            </div>
            {processactivity.length === 0 ? (
              <h2
                style={{
                  textAlign: "center",
                  paddingTop: "50px",
                  fontWeight: "bold",
                  color: "#3f6ad8",
                }}
              >
                Chưa có hoạt động
              </h2>
            ) : (
              <div className="row">

                <div className="offset-lg-1 col-lg-10">
                  <div className="blog-detail">
                    <div
                      className="next-prev-posts"
                      style={{
                        display: "flex",
                        alignContent: "center",
                        paddingBottom: "20px",
                      }}
                    >

                      <h2 style={{ color: '#00a6d3', width: '800px' }}>{currentObject?.processTitle}</h2>

                    </div>
                    <p style={{ fontSize: '20px', color: 'black', fontWeight: 400 }}>
                      {currentObject?.description}
                    </p>
                    <div className="blog-details-meta">
                      {currentObject?.media?.length !== 0 ?

                        <Slider {...settings}>
                          {currentObject?.media?.map((item, index) => {
                            return <figure key={index}><img src={item.linkMedia} alt style={{ height: '500px', width: '100%' }} /></figure>
                          })}
                        </Slider>
                        :
                        <div></div>
                      }
                      <ul style={{ paddingTop: '50px' }}>

                        <li style={{ display: 'flex', fontSize: '20px', paddingBottom: '20px' }}>
                          <div style={{ paddingRight: '10px', color: 'black' }}>- Bắt đầu:</div>
                          <i style={{ fontSize: '20px' }}>

                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                              <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                              <line x1={16} y1={2} x2={16} y2={6} />
                              <line x1={8} y1={2} x2={8} y2={6} />
                              <line x1={3} y1={10} x2={21} y2={10} />
                            </svg></i> <span style={{ fontWeight: 800 }}>{DateTime(currentObject?.startDate)}</span></li>
                        <li style={{ display: 'flex', fontSize: '20px' }}>
                          <div style={{ paddingRight: '10px', color: 'black' }}>- Kết thúc:</div>
                          <i style={{ fontSize: '20px' }}>

                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                              <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                              <line x1={16} y1={2} x2={16} y2={6} />
                              <line x1={8} y1={2} x2={8} y2={6} />
                              <line x1={3} y1={10} x2={21} y2={10} />
                            </svg></i> <span style={{ fontWeight: 800 }}>{DateTime(currentObject?.endDate)}</span></li>
                      </ul>

                      {/* <h3 style={{ fontWeight: "bold" }}>
                        Thông tin chi tiết :
                      </h3> */}

                      {currentObject.isParticipant ?
                        <div style={{ fontSize: '20px', color: 'black', fontWeight: 400, display: 'flex', paddingBottom: '20px' }}>
                          <div>{currentObject.isParticipant ? <div> - Kêu gọi người tham gia:</div> : <div></div>}</div>
                          <div style={{ marginLeft: '5px' }}>{currentObject.targetParticipant !== 0 ? <div style={{ fontWeight: 600 }}> {(currentObject?.targetParticipant)?.toLocaleString()} người</div> : <div></div>}</div>
                        </div> : <div></div>}
                      {currentObject.isDonateProcess ?
                        <div style={{ fontSize: '20px', color: 'black', fontWeight: 400, display: 'flex', paddingBottom: '20px' }}>
                          <div>{currentObject.isDonateProcess ? <div> - Kêu gọi quyên góp:</div> : <div></div>}</div>
                          <div style={{ marginLeft: '5px' }}>{currentObject.targetDonation !== 0 ? <div style={{ fontWeight: 600 }}> {(currentObject?.targetDonation).toLocaleString()} vnđ</div> : <div></div>}</div>
                        </div> : <div></div>}
                      <div style={{ fontSize: '20px', color: 'black', fontWeight: 400 }}>- Địa điểm: <span style={{ fontWeight: 600 }}>{currentObject?.location}</span></div>
                    </div>
                    <div
                      className="next-prev-posts"
                      style={{ display: "flex", alignContent: "center" }}
                    >
                      <div
                        className={`prev ${currentIndex === 0 ? "disabled" : ""
                          }`}
                        style={{ cursor: "pointer" }}
                        onClick={handlePrevious}
                      >
                        <div className="prem" title>
                          <i
                            style={{ color: "#00a6d3" }}
                            className="icofont-curved-double-left"
                          />
                          <div className="translate">
                            <span className="pe" style={{ color: "#00a6d3" }}>
                              Trang trước
                            </span>
                            <p>Xem lại hoạt động trước.</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`next ${currentIndex === processactivity.length - 1
                          ? "disabled"
                          : ""
                          }`}
                        style={{ cursor: "pointer" }}
                        onClick={handleNext}
                      >
                        <div className="pre" title>
                          <i
                            style={{ color: "#00a6d3" }}
                            className="icofont-curved-double-right"
                          />
                          <div className="translate">
                            <span className="per" style={{ color: "#00a6d3" }}>
                              Trang sau
                            </span>
                            <p>Xem tiếp hoạt động sau.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* <figure className="bottom-mockup"><img src="images/footer.png" alt /></figure> */}
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className>© SVCW</span>
            </div>
          </div>
        </div>
      </div>



      {isOpen === true ? (
        <div className="post-new-popup" style={popupStyle}>
          <div
            className="popup"
            style={{ width: 800, zIndex: 80 }}
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
                  Chỉnh sửa hoạt động
                </h5>
              </div>
            </div>

            <div className="Chiến dịch 1">
              <header className="header"></header>
              <div className="form-wrap">
                <form
                  id="survey-form"
                  method="post"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Tên hoạt động
                        </label>
                        <input
                          type="text"
                          name="processTitle"
                          onChange={formik.handleChange}
                          value={formik.values.processTitle}
                          id="name"
                          placeholder="Nhập tên hoạt động"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Mô tả hoạt động
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={formik.handleChange}
                          value={formik.values.description}
                          id="email"
                          placeholder="Nhập Mô Tả"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                      <label id="email-label" htmlFor="email">
                          Ngày bắt đầu
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          onChange={formik.handleChange}
                          value={moment(formik.values.startDate).format('YYYY-MM-DD')}
                          id="name"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                      <label id="email-label" htmlFor="email">
                          Ngày kết thúc
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          onChange={formik.handleChange}
                          value={moment(formik.values.endDate).format('YYYY-MM-DD')}
                          id="name"
                          placeholder="Nhập Nơi Diễn Ra"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Loại hoạt động
                        </label>
                        <select
                          data-te-select-init
                          data-te-select-visible-options="3"
                          name="processTypeId"
                          onChange={formik.handleChange}
                          value={formik.values.processTypeId}
                          id="name"
                          className="form-control"
                        >
                          <option value={currentObject.processTypeId}>
                            abc
                          </option>
                          {processType.map((item, index) => {
                            return (
                              <option value={item.processTypeId} key={index}>
                                {item.processTypeName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div> */}

                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        id="submit"
                        className="btn btn-primary btn-block"
                      >
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

      {isOpen1 === true ? (
        <div className="post-new-popup" style={popupStyle1}>
          <div
            className="popup"
            style={{ width: 800, marginTop: "100px", zIndex: 80 }}
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
                  Thêm mới hoạt động
                </h5>
              </div>
            </div>

            <div className="Chiến dịch 1">
              <header className="header"></header>
              <div className="form-wrap">
                <form
                  id="survey-form"
                  method="post"
                  onSubmit={formik1.handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Tên hoạt động
                        </label>
                        <input
                          type="text"
                          name="processTitle"
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Nhập tên hoạt động"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Mô tả hoạt động
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={formik1.handleChange}
                          id="email"
                          placeholder="Nhập Mô Tả"
                          className="form-control"
                          required
                        />
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
                          onChange={formik1.handleChange}
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
                          type="date"
                          name="endDate"
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Nhập nơi diễn ra"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Loại hoạt động
                        </label>
                        <select
                          data-te-select-init
                          data-te-select-visible-options="3"
                          name="processTypeId"
                          onChange={formik1.handleChange}
                          id="name"
                          className="form-control"
                        >
                          <option value={""}>Chọn loại hoạt động</option>
                          {processType.map((item, index) => {
                            return (
                              <option value={item.processTypeId} key={index} onClick={() => {
                                setType(item.processTypeId)
                              }}>
                                {item.processTypeName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row" >
                    <div className="col-md-6">
                      {typeProcess === "pt002" ? (
                        <div className="form-group mt-3" >
                          <label id="name-label" htmlFor="name">
                            Số người tham gia
                          </label>
                          <input
                            type="number"
                            name="targetParticipant"
                            value={formik1.values.targetParticipant}
                            onChange={formik1.handleChange
                            }
                            id="name"
                            className="form-control"
                            required
                          />
                        </div>
                      ) : typeProcess === "pt001" ? (
                        <div className="form-group mt-3">
                          <label id="name-label" htmlFor="name">
                            Số tiền ủng hộ
                          </label>
                          <input
                            type="text"
                            name="targetDonation"
                            value={formik1.values.targetDonation}
                            onChange={formik1.handleChange
                            }
                            id="name"
                            className="form-control"
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Hình Ảnh</label>
                        <div>
                          <form>
                            <fieldset className="upload_dropZone text-center mb-3 p-4">
                              <legend className="visually-hidden">
                                Tải lên hình ảnh
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
                                Chọn Hình Ảnh
                              </label>
                              <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                            </fieldset>
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

                        <div className="image-container">
                          {images.map((image, index) => (
                            <div className="image-item" key={index}>
                              <img
                                src={image.url}
                                alt={`Image ${index}`}
                                className="image-preview"
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

                        {files !== "" ? (
                          <img src={files} style={{ height: "300px" }} />
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        id="submit"
                        className="btn btn-primary btn-block"
                      >
                        Hoàn Thành
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

      {isOpen1 === true ? (
        <div className="post-new-popup" style={popupStyle1}>
          <div
            className="popup"
            style={{ width: 800, marginTop: "100px", zIndex: 80 }}
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
                  Thêm mới hoạt động 
                </h5>
              </div>
            </div>

            <div className="form1">
              <header className="header"></header>
              <div className="form-wrap">
                <form
                  id="survey-form"
                  method="post"
                  onSubmit={formik1.handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Tên hoạt động
                        </label>
                        <input
                          type="text"
                          name="processTitle"
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Nhập tên hoạt động"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Mô tả hoạt động
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={formik1.handleChange}
                          id="email"
                          placeholder="Nhập Mô Tả"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Ngày Bắt Đầu
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          onChange={formik1.handleChange}
                          id="name"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Ngày Kết Thúc
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Nhập Nơi Diễn Ra"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Loại hoạt động
                        </label>
                        <select
                          data-te-select-init
                          data-te-select-visible-options="3"
                          name="processTypeId"
                          onChange={(e) => {
                            formik1.handleChange(e); // Cập nhật giá trị trong biểu mẫu
                            const selectedValue = e.target.value; // Lấy giá trị mới được chọn
                            setType(selectedValue); // Thực hiện hành động khác tùy thuộc vào giá trị được chọn
                            if (e.target.value === 'pt002') {
                              formik1.setFieldValue('isDonateProcess', false)
                              formik1.setFieldValue('targetDonation', 0)
                              formik1.setFieldValue('isParticipant', true)

                            } else if (e.target.value === 'pt001') {
                              formik1.setFieldValue('isDonateProcess', true)
                              formik1.setFieldValue('targetParticipant', 0)
                              formik1.setFieldValue('isParticipant', false)

                            }
                          }}
                          id="name"
                          className="form-control"
                        >
                          <option value={""}>Chọn loại hoạt động</option>
                          {processType.map((item, index) => {
                            return (
                              <option value={item.processTypeId} key={index} >
                                {item.processTypeName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Địa điểm
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formik1.values.location}
                          onChange={formik1.handleChange}
                          id="name"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row" >
                    <div className="col-md-6">
                      {typeProcess === "pt002" ? (
                        <div className="form-group mt-3" >

                          <label id="name-label" htmlFor="name">
                            Số người tham gia
                          </label>
                          <input
                            type="number"
                            name="targetParticipant"
                            value={formik1.values.targetParticipant}
                            onChange={formik1.handleChange
                            }
                            id="name"
                            className="form-control"
                            required
                          />
                        </div>
                      ) : typeProcess === "pt001" ? (
                        <div className="form-group mt-3">
                          <label id="name-label" htmlFor="name">
                            Số tiền ủng hộ
                          </label>
                          <input
                            type="text"
                            name="targetDonation"
                            value={formik1.values.targetDonation}
                            onChange={formik1.handleChange
                            }
                            id="name"
                            className="form-control"
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Hình Ảnh</label>
                        <div>
                          <form>
                            <fieldset className="upload_dropZone text-center mb-3 p-4">
                              <legend className="visually-hidden">
                                Tải Lên Hình Ảnh
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
                                Chọn Hình Ảnh
                              </label>
                              <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                            </fieldset>
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

                        <div className="image-container">
                          {images.map((image, index) => (
                            <div className="image-item" key={index}>
                              <img
                                src={image.url}
                                alt={`Image ${index}`}
                                className="image-preview"
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

                        {files !== "" ? (
                          <img src={files} style={{ height: "300px" }} />
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        id="submit"
                        className="btn btn-primary btn-block"
                      >
                        Hoàn Thành
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
