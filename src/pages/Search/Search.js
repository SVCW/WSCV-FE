import React from "react";
import { useEffect } from "react";
import { GetActivitySreachAction } from "../../redux/actions/ActivityAction";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";
import {NavLink} from 'react-router-dom'
export default function Search(props) {
  const dispatch = useDispatch();
  const { arrActivitySearch } = useSelector((root) => root.ActivityReducer);
  console.log(arrActivitySearch);
  const { title } = props.match.params;
  console.log(title);
  useEffect(() => {
    const search = {
      search: title,
    };
    const action = GetActivitySreachAction(search);
    dispatch(action);
  }, [title]);
  return (
    <div>
      <div
        className="container "
        style={{ fontSize: "20px", fontWeigh: 800, paddingTop: "100px" }}
      >
        Kết quả tìm kiếm cho: <span style={{ fontWeight: 800 }}>{title}</span>
      </div>
      <div className="search-container-1">
        <div
          className="search-input-1"
          style={{ fontWeight: 700, fontSize: "20px" }}
        >
          Bài viết
        </div>
        <div className="search-results-1">
          {arrActivitySearch?.activities?.length === 0 ? (
            "Không tìm thấy kết quả phù hợp"
          ) : (
            <Fragment>
              {arrActivitySearch?.activities?.map((item, index) => {
                return (
                  <div className="search-result-1" style={{ display: "flex" }}>
                    <div style={{ width: "15%" }}>
                      <div>
                        {item.image?.length === 0 ? (
                          <img src="../images/avatar.jpg" />
                        ) : (
                          <img src={item.media?.[0]?.linkMedia} />
                        )}
                      </div>
                    </div>
                    <div style={{ width: "75%", marginLeft: "20px" }}>
                    <h5><NavLink to={`/detailactivity/${item.activityId}`}>{item.title}</NavLink></h5>
                      <p>{item.description.slice(0, 200)}</p>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>
      </div>
      <div className="search-container-1">
        <div
          className="search-input-1"
          style={{ fontWeight: 700, fontSize: "20px" }}
        >
          Mọi người
        </div>
        <div className="search-results-1">
            {arrActivitySearch?.users?.length === 0? (
            "Không tìm thấy kết quả phù hợp"
          ) :
          <Fragment>
            {arrActivitySearch?.users?.map((item, index) => {
            return (
              <div className="search-result-1" style={{ display: "flex" }}>
                <div style={{ width: "15%" }}>
                  <div>
                    {item.image === "none" ? (
                      <img src="../images/avatar.jpg" />
                    ) : (
                      <img src={item.image} />
                    )}
                  </div>
                </div>
                <div style={{ width: "75%", marginLeft: "20px" }}>
                  <h5><NavLink to={`/profile/${item.userId}`}>{item.fullName}</NavLink></h5>
                  <p>{item.username}</p>
                </div>
              </div>
            );
          })}
          </Fragment>
}
        </div>
      </div>
      <div className="search-container-1">
        <div
          className="search-input-1"
          style={{ fontWeight: 700, fontSize: "20px" }}
        >
         Tổ chức
        </div>
        <div className="search-results-1">
            {arrActivitySearch?.fanpages?.length === 0? (
            "Không tìm thấy kết quả phù hợp"
          ) :
          <Fragment>
            {arrActivitySearch?.fanpages?.map((item, index) => {
            return (
              <div className="search-result-1" style={{ display: "flex" }}>
                <div style={{ width: "15%" }}>
                  <div>
                    {item.image === "none" ? (
                      <img src="../images/avatar.jpg" />
                    ) : (
                      <img src={item.avatar} />
                    )}
                  </div>
                </div>
                <div style={{ width: "75%", marginLeft: "20px" }}>
                  <h5><NavLink  to={`/fanpage/${item.fanpageId}`}>{item.fanpageName}</NavLink></h5>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
          </Fragment>
}
        </div>
      </div>
    </div>
  );
}
