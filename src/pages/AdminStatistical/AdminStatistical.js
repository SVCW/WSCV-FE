import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { GetStatisticalAction, GetStatisticalAdminAction, GetStatisticalAdminDonateAction } from "../../redux/actions/StatisticalAction";
import { Chart } from "primereact/chart";
import {NavLink} from 'react-router-dom'
const AdminStatistical = (props) => {
  const [selectedValue, setSelectedValue] = useState(true);
  const [selectedValue1, setSelectedValue1] = useState(true);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };
  const handleOptionClick1 = (value) => {
    setSelectedValue1(value);
  };
  const dispatch = useDispatch();
  const { arrStaticaladmin,arrStaticalAdminDonate } = useSelector((root) => root.StatisticalReducer);
  console.log(arrStaticalAdminDonate);
  useEffect(() => {
    const action = GetStatisticalAdminAction( year);
    dispatch(action);
    const action1 = GetStatisticalAdminDonateAction( year);
    dispatch(action1);
  }, []);
  const [year, setYear] = useState("2023");
  const [year1, setYear1] = useState("2023");
  const [arr, setArr] = useState([]);
  useEffect(() => {
   
    setArr(
      arrStaticaladmin?.map((item, index) => {
        return selectedValue
          ? item.newUser
          : item.newUser;
      })
    );
  }, [arrStaticaladmin, selectedValue]);


  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5 ",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Tình nguyện viên",
          data: arr,
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-400"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);


   


  }, [arr]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  return (
    <div className="" style={{position:'absolute', marginTop:'10px',  width: "1800px"}}>
      <div className="">
        <section>
          <div className="top-area bluesh high-opacity">
            <div
              className="bg-image"
              style={{ backgroundImage: "url(images/resources/top-bg.jpg)" }}
            />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="post-subject">
                    <div className="university-tag">
                      <div className="Search-result">
                        <h4>
                          {" "}
                          <strong>Thống kê</strong>
                        </h4>
                      </div>
                    </div>
                    <ul className="nav nav-tabs post-detail-btn">
                      <li
                        className="nav-item"
                        onClick={() => handleOptionClick(true)}
                      >
                        <NavLink
                          className="active"
                         to="/adminstatistical"
                          data-toggle="tab"
                        >
                          Tình nguyện viên tham gia SVCW
                        </NavLink>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => handleOptionClick1(false)}
                      >
                        <NavLink to="/adminstatistical1" className href="#members" data-toggle="tab">
                          Số tiền ủng hộ đã nhận trên SVCW
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="gap" style={{padding:0}}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div id="page-contents" className="row merged20">
                    <div className="col-lg-12">
                      <div className="tab-content">
                        <div
                          className="tab-pane fade active show"
                          id="allposts"
                        >
                          <div className="main-wraper">
                            <div style={{ display: "flex" }}>
                              <div className="main-title">
                                Tình nguyện viên tham gia trên SVCW năm {year}
                              </div>
                              <select
                                style={{
                                  width: "80px",
                                  height: "20px",
                                  border: "transparent",
                                }}
                                onClick={(e) => {
                                  setYear(e.target.value);
                                  const action = GetStatisticalAdminAction(
                                    e.target.value
                                  );
                                  dispatch(action);
                                }}
                              >
                                <option value="2022">2022</option>
                                <option value="2023" selected>
                                  2023
                                </option>
                                <option value="2024">2024</option>
                              </select>
                            </div>
                            <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
      </div>
                          </div>
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
      
    </div>
  );
};

export default AdminStatistical;
