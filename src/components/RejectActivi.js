import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { QuitActivityAction } from "../redux/actions/ActivityAction";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
export default function RejectActivi(props) {
  const dispatch = useDispatch();
  const {
    actireject,
    popupStyleActiReject,
    handleClickActiReject,
    actirejectid,
  } = props;
  const [id, setID] = useState(actirejectid);
  const SignupSchema = Yup.object().shape({
      reasonQuit: Yup.string()
      .required('Vui lòng điền lý do muốn ngừng chiến dịch'),
  });
  const formik = useFormik({
    initialValues: {
      activityId: actirejectid,
      reasonQuit: "",
    },
    enableReinitialize:true,
    validationSchema: SignupSchema,
    onSubmit: (value) => {
      formik.setFieldValue("activityId", actirejectid);
      const action = QuitActivityAction(value);
      dispatch(action);
      handleClickActiReject()
    },
  });
  useEffect(() => {
    formik.setFieldValue("activityId", actirejectid);
  }, []);
  return (
    <div>
      {actireject === true ? (
        <div className="post-new-popup" style={popupStyleActiReject}>
          <div
            className="popup"
            style={{ width: 800, zIndex: 80, marginTop: "-50px" }}
          >
            <span className="popup-closed" onClick={handleClickActiReject}>
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
                  Ngừng chiến dịch
                </h5>
              </div>
            </div>

            <div style={{ padding: "40px 0" }}>
              <form onSubmit={formik.handleSubmit}>
                <div className="form row mt-3">
                  <div className="form-group">
                    <label>Lý do</label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="2"
                      cols="50"
                      name="reasonQuit"
                      onChange={formik.handleChange}
                      
                    ></textarea>
                    <div className="error">{formik.errors.reasonQuit}</div>
                  </div>

                  <div className="row" style={{}}>
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Đồng ý
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
