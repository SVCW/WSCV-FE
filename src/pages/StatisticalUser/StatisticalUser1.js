import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { GetStatisticalAction } from "../../redux/actions/StatisticalAction";
import { Chart } from "primereact/chart";
import {NavLink} from 'react-router-dom'
const StatisticalUser1 = (props) => {
  const [selectedValue, setSelectedValue] = useState(true);
const dispatch = useDispatch()
  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };
  const [year, setYear] = useState("2023");
  const [arr1, setArr1] = useState([]);

  const { arrStatical } = useSelector((root) => root.StatisticalReducer);
  console.log(arrStatical);
  useEffect(() => {
    setArr1(
      arrStatical
        ?.filter((item) => item.status === "success")
        ?.map((item, index) => {
          return selectedValue ? item.donated : item.totalDonate;
        })
    );
   
  }, [arrStatical, selectedValue]);
  useEffect(() => {
    const action = GetStatisticalAction(localStorage.getItem("userID"), year);
    dispatch(action);
  }, []);

  useEffect(() => {
   


    const documentStyle1 = getComputedStyle(document.documentElement);
    const textColor1 = documentStyle1.getPropertyValue("--text-color");
    const textColorSecondary1 = documentStyle1.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder1 = documentStyle1.getPropertyValue("--surface-border");
    const data1 = {
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
      ],
      datasets: [
        {
          label: "Số tiền",
          data: arr1,
          fill: false,
          borderColor: documentStyle1.getPropertyValue("--blue-400"),
          tension: 0.4,
        },
      ],
    };
    const options1 = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor1,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary1,
          },
          grid: {
            color: surfaceBorder1,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary1,
          },
          grid: {
            color: surfaceBorder1,
          },
        },
      },
    };

    setChartData1(data1);
    setChartOptions1(options1);


  }, [arr1]);

  const [chartData1, setChartData1] = useState({});
  const [chartOptions1, setChartOptions1] = useState({});



  return (
    <div className="" style={{ marginTop: "100px" }}>
      <div className="theme-layout">
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
                          
                        to ="/statisticaluser"
                          data-toggle="tab"
                        >
                          Chiến dịch đã tạo
                        </NavLink>
                      </li>
                      <li
                        className="nav-item"
                        onClick={() => handleOptionClick(false)}
                      >
                        <NavLink  to="/statisticaluser1" className="active" data-toggle="tab">
                          Số tiền đã ủng hộ
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
          <div className="gap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div id="page-contents" className="row merged20">
                    <div className="col-lg-12">
                      <div className="tab-content">
                       
                        <div className="tab-pane fade active show" id="members">
                          <div className="main-wraper">
                            <div style={{ display: "flex" }}>
                              <div className="main-title">
                                Thống kê số tiền đã ủng hộ {year}
                              </div>
                              <select
                                style={{
                                  width: "80px",
                                  height: "20px",
                                  border: "transparent",
                                }}
                                onClick={(e) => {
                                  setYear(e.target.value);
                                  const action = GetStatisticalAction(
                                    localStorage.getItem("userID"),
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
                            <Chart type="line" data={chartData1} options={chartOptions1} />
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

export default StatisticalUser1;
