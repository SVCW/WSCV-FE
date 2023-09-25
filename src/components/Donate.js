import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DonationAction } from "../redux/actions/DonationAction";
import { NumericFormat } from "react-number-format";
import * as Yup from 'yup';
export default function Donate(props) {
  const { isPopupOpen, openPopup, donate } = props;
  const [error, setError] = useState("1");
  const { message } = useSelector((root) => root.DonationReducer);
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tiêu đề'),
    amount: Yup.string()
    .matches(/^[0-9,]+$/, 'Số tiền phải là số dương')
    .test('is-number', 'Số tiền phải là số dương', value => {
      if (!value) return true; // Allow empty value
      const numberValue = Number(value.replace(/,/g, ''));
      return !isNaN(numberValue);
    })
    .required('Vui lòng nhập số tiền'),
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
    name: Yup.string().required('Vui lòng nhập tên'),
  });
  
  const formik1 = useFormik({
    initialValues: {
      title: "",
      amount: 0,
      email: localStorage.getItem("emailuser"),
      phone: "",
      name: localStorage.getItem("username"),
      isAnonymous: true,
      activityId: donate,
    },
    enableReinitialize: true,
  validationSchema, // Sử dụng schema validation ở đây
    onSubmit: async (value) => {
      const action = await DonationAction(value, openPopup);
      await dispatch(action);
    },
  });

  return (
    <div>
      {isPopupOpen && (
        <div className="popup-overlay">
          {/* <div className="popup-container"> */}
          {/* <h2>Popup Form</h2> */}

          <div className="container">
            <header className="header">
              {/* <h1 id="title" className="text-center">Survey Form</h1>
                                <p id="description" className="text-center">
                                    Thank you for taking the time to help us improve the platform
                                </p>
                                <button className="close-button" onClick={closePopup}>&times;</button> */}
            </header>
            <div className="form-wrap">
              <form
                id="survey-form"
                onSubmit={formik1.handleSubmit}
                method="post"
              >
                <h3 id="title" className="text-center">
                  Vui lòng điền thông tin của bạn
                </h3>
                <button className="close-button" onClick={openPopup}>
                  &times;
                </button>
                <div className="row ">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Nội dung:
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={formik1.handleChange}
                        id="name"
                        placeholder="Nhập nội dung"
                        className="form-control"
                        required
                      />
                      <div className="error">{formik1.errors.title}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="email-label" htmlFor="email">
                        Số tiền:
                      </label>

                      <NumericFormat
                        placeholder="Nhập số tiền"
                        className="form-control"
                        name="amount"
                        onChange={formik1.handleChange}
                        value=""
                        allowLeadingZeros
                        thousandSeparator=","
                      />
                      <div style={{ color: "red" }}>{message}</div>
                      <div className="error">{formik1.errors.amount}</div>
                    </div>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Email:
                      </label>
                      <input
                        disabled
                        type="email"
                        value={formik1.values.email}
                        name="email"
                        onChange={formik1.handleChange}
                        id="validationDefault01"
                        placeholder="Nhập email"
                        className="form-control"
                        required
                      />
                      <div className="error">{formik1.errors.email}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="email-label" htmlFor="email">
                        Số điện thoại:
                      </label>
                      <input
                        type="text"
                        name="phone"
                        onChange={formik1.handleChange}
                        id="email"
                        placeholder="Nhập số điện thoại"
                        className="form-control"
                        required
                      />
                      <div className="error">{formik1.errors.phone}</div>
                    </div>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Họ tên:
                      </label>
                      <input
                        // disable: không cho chỉnh sửa
                        disabled
                        type="text"
                        name="name"
                        value={formik1.values.name}
                        onChange={formik1.handleChange}
                        id="name"
                        placeholder="Họ và tên"
                        className="form-control"
                        required
                      />
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
                      Hoàn thành
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* </div> */}
        </div>
      )}
    </div>
  );
}
