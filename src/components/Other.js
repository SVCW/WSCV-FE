import React from "react";
import YourFanpage from "./YourFanpage";
import RecommentActivity from "./RecommentActivity";
import Game from "./Game";
import Calendar from "react-calendar";

export default function Other() {
  return (
    <div className="col-lg-4">
      <aside className="sidebar static right">
        <RecommentActivity />
       <Calendar />
      </aside>
    </div>
  );
}
