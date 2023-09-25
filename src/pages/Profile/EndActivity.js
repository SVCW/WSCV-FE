import React from "react";
import ListEndActivity from "../../components/ListEndActivity";
import Other from "../../components/Other";

export default function EndActivity (props) {
  const { arrEndActivityByUserID, getUserId } = props;

  return (
    <div className=" tab-pane fade show " id="endactivity">
      <div className="row merged20">
        <div className="col-lg-8">
          <div className="">
            <ListEndActivity
              arrActivity={arrEndActivityByUserID}
            />
          </div>

          
        </div>
        <Other />
      </div>
    </div>
  );
}
