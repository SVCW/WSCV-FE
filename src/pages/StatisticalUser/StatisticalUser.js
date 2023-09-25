import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { GetStatisticalAction } from "../../redux/actions/StatisticalAction";
import { Chart } from "primereact/chart";
import {NavLink} from 'react-router-dom'
const StatisticalUser = (props) => {
  const [selectedValue, setSelectedValue] = useState(true);
const dispatch = useDispatch()
  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };
  const [year, setYear] = useState("2023");
  const [arr, setArr] = useState([]);

  const { arrStatical } = useSelector((root) => root.StatisticalReducer);
  console.log(arrStatical);
  useEffect(() => {
   
    setArr(
      arrStatical?.map((item, index) => {
        return selectedValue
          ? item.totalNumberActivityCreate
          : item.totalNumberActivityCreate;
      })
    );
  }, [arrStatical, selectedValue]);
  useEffect(() => {
    const action = GetStatisticalAction(localStorage.getItem("userID"), year);
    dispatch(action);
  }, []);

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
          label: "Chiến dịch đã tạo",
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
                          className="active"
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
                        <NavLink className to ="/statisticaluser1" data-toggle="tab">
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
                        <div
                          className="tab-pane fade active show"
                          id="allposts"
                        >
                          <div className="main-wraper">
                            <div style={{ display: "flex" }}>
                              <div className="main-title">
                                Thống kê số chiến dịch đã tạo năm {year}
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

export default StatisticalUser;
