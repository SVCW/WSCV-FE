import React from "react";
export default function Clock() {
  return (
    <div className="widget whitish low-opacity">
      <img src="../images/time-clock.png" />
      <div
        className="bg-image"
        style={{ backgroundImage: 'url("./images/giphy-sample.gif")' }}
      />
      <div className="date-time">
        <div className="realtime">
          <span id="hours">21</span>
          <span id="point">:</span>
          <span id="min">53</span>
        </div>
        <span id="date" />
      </div>
    </div>
  );
}
