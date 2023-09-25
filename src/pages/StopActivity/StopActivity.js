import React from "react";
import ListEndActivity from "../../components/ListEndActivity";
import Other from "../../components/Other";
import ListStopActivity from "./ListStopActivity";

export default function StopActivity (props) {
  const { arrEndActivityByUserID, getUserId } = props;
console.log(arrEndActivityByUserID)
  return (
    <div className=" tab-pane fade show " id="stopactivity">
      <div className="row merged20">
        <div className="col-lg-8">
          <div className="">
            <ListStopActivity
              arrActivity={arrEndActivityByUserID}
              getUserId = {getUserId}
            />
          </div>

          
        </div>
       
      </div>
    </div>
  );
}