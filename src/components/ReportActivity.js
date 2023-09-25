import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateReportAction } from "../redux/actions/ReportAction";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useEffect } from "react";
export default function ReportActivity(props) {
  const {
    report,
    handleClick,
    popupStyle3,
    reportiduser,
    reportid,
    arrReportType,
  } = props;
  const dispatch = useDispatch();
  const SignupSchema = Yup.object().shape({
    reportTypeId: Yup.string().required("Vui phòng chọn loại cần báo cáo"),
    reason: Yup.string().required("Vui lòng điền lý do báo cáo"),
  });

  const formik6 = useFormik({
    initialValues: {
      reportId: "string",
      title: "string",
      reason: "",
      reportTypeId: "",
      description: "string",
      status: true,
      userId: localStorage.getItem("userID"),
      userReportId: reportiduser,
      activityId: reportid,
    },
    enableReinitialize: true,
    validationSchema: SignupSchema,
    onSubmit: async (value) => {
      if (value.reportTypeId === "rt006") {
        console.log("1");
        const form = {
          reportId: "string",
          title: value.title,
          reason: value.reason,
          reportTypeId: value.reportTypeId,
          description: value.description,
          status: true,
          userId: localStorage.getItem("userID"),
          userReportId: reportiduser,
        };
            const action = await CreateReportAction(form);
          await dispatch(action);
          const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
          });

          Toast.fire({
              icon: 'success',
              title: `Báo cáo người dùng thành công `,
          });
          handleClick()
      } else {
        const form = {
            reportId: "string",
            title: value.title,
            reason: value.reason,
            reportTypeId: value.reportTypeId,
            description: value.description,
            status: true,
            userId: localStorage.getItem("userID"),
            activityId: reportid,
          };
               const action = await CreateReportAction(form);
          await dispatch(action);
          const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
          });

          Toast.fire({
              icon: 'success',
              title: `Báo cáo chiến dịch thành công `,
          });
          handleClick()
      }
    //   const value1 = { ...value, activityId: reportid };
     
    },
  });


  const [option, setOption] = useState("");
  const onInputDropdown = (e) => {
    formik6.setFieldValue("reportTypeId", e.target.value);
    setOption(e.target.value);
  };
  return (
    <div>
      {report ? (
        <div className="post-new-popup1" style={popupStyle3}>
          <div
            className="popup"
            style={{
              width: 600,
              zIndex: 80,

              // overflowY: "scroll",
              padding: "40px 30px",
              marginTop: "-100px",
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
                  Báo cáo
                </h5>
              </div>
            </div>
            <div>
              <form onSubmit={formik6.handleSubmit}>
                <div className="form row mt-3">
                  <div className="form-group">
                    <label>Loại báo cáo</label>
                    <select
                      onChange={(e) => onInputDropdown(e)} // Pass the formIndex to handleSelectChange
                      className="form-control"
                      placeholder="Chọn loại báo cáo"
                      value={option}
                      required
                    >
                      <option value="">Chọn loại báo cáo</option>
                      {arrReportType.map((item, index) => {
                        return (
                          <option value={item.value} key={index}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <div className="error">{formik6.errors.reportTypeId}</div>
                  </div>
                  <div className="form-group">
                    <label>Lý do</label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="2"
                      cols="50"
                      name="reason"
                      onChange={formik6.handleChange}
                      required
                    ></textarea>
                    <div className="error">{formik6.errors.reason}</div>
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
