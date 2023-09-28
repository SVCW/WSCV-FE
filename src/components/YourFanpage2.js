import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
export default function YourFanpage2 () {

  const { getUserId } = useSelector((root) => root.ProfileReducer);


  return (
    <div className="">
      <aside className="sidebar static right">
        {localStorage.getItem("userID") &&
          getUserId?.fanpage?.status === "Active" ? (
          <div className="widget">
            <h4 className="widget-title">Tổ chức của bạn</h4>
            <ul className="">
              <li style={{display:'flex', flexDirection:'column'}}>
                <figure>
                  <NavLink to={`/fanpage/${localStorage.getItem("userID")}`}>
                    <img
                      style={{
                        width: "250px",
                        height: "150px",
                        objectfit: "cover",
                      }}
                      src={getUserId?.fanpage?.avatar}
                      alt
                    />
                  </NavLink>
                </figure>
                <div className="your-grp">
                  <h5>
                    <NavLink
                      to={`/fanpage/${localStorage.getItem("userID")}`}
                      title
                      style={{
                        fontSize: "20px",
                        width: "350px",

                      }}
                    >
                      {getUserId?.fanpage?.fanpageName}
                    </NavLink>
                  </h5>
                  <p>{(getUserId?.fanpage?.description).slice(0,200)}</p>
                  {/* <NavLink
                    to={`/fanpage/${localStorage.getItem("userID")}`}
                    href="group-feed.html"
                    title
                    className="fanpage-y"
                    onClick={() => { }}
                  >
                    Chi tiết
                  </NavLink> */}
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div></div>
        )}
      
        
      </aside>
    </div>
  );
}
