import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom'

export default function Success() {
  return (

  <div className="error-page">
    <div id="container-inside">
      <div id="circle-small" />
      <div id="circle-medium" />
      <div id="circle-large" />
      <div id="circle-xlarge" />
      <div id="circle-xxlarge" />
    </div>
    <div className="thanks-purchase">
      <div className="logo" style={{marginRight:'32px'}}>
        <img src="images/logo.png" alt="" />
        <span>SVCW</span>
      </div>
      <h2 style={{fontWeight: 700}}>Thành công!</h2>
      <span>Điểm danh thành công</span>
      <p>
        Chúc bạn có trải nghiệm tốt 
        <NavLink to="/loginmobile" className="button dark circle" href="#" title="">
          Cảm ơn
        </NavLink>
      </p>
    </div>
  </div>

  )
}
