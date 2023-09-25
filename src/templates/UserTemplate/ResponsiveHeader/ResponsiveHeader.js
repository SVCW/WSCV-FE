import React, { useEffect, useState } from 'react'
import { GetProfileByIdAction } from '../../../redux/actions/ProfileAction';
import { useDispatch, useSelector } from 'react-redux';
import {NavLink} from 'react-router-dom'
export default function ResponsiveHeader () {
    const { userID } = useSelector((root) => root.LoginReducer);

    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const { getUserId, arrActivityUser } = useSelector(
      (root) => root.ProfileReducer
    );
  useEffect(() => {
    // const action = GetProfileByIdAction(userID);
    // dispatch(action);
  }, []);
    return (

        <div className="responsive-header">
            <div className="logo res"><img src="images/logo.png" alt /><span>SVCW</span></div>
            <div className="user-avatar mobile">
            <NavLink to={`/profile/${localStorage.getItem("userID")}`} title="View Profile">
                <img
                  alt=''
                  sizes=''
                  src={
                    getUserId?.image === "none"
                      ? "../images/avatar.jpg"
                      : getUserId?.image
                  }
                /></NavLink>
                <div className="name">
                <NavLink to={`/profile/${localStorage.getItem("userID")}`}>
                    <h4 style={{paddingTop:'6px', fontSize:'18px', paddingLeft:'5px'}}>{getUserId?.username}</h4>
                    </NavLink>
                </div>
            </div>
            <div className="right-compact">
               
            </div>
            <div className="restop-search">
                <span className="hide-search"><i className="icofont-close-circled" /></span>
                <form method="post">
                    <input type="text" placeholder="Search..." />
                </form>
            </div>
        </div>
    )
}
