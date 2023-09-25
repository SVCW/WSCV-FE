import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import ItemActivityFanpage from "./ItemActivityFanpage";
import Game from "../../components/Game";

export default function ListActivityFanpage(props) {
  let { arrActivity, fanpageId } = props;

  const { userID } = useSelector((root) => root.LoginReducer);
  return (
    <div className="row">
      <div className="col-lg-9">
        {arrActivity
          ?.filter((item) => item.status === "Active")
          ?.map((item, index) => {
            const detailItem = item;
            let isAlreadyLiked = false;
            let isAlreadyJoined = false;
            let isAlreadyFollowed = false;
            item?.like?.map((user) => {
              if (user.userId === userID) {
                isAlreadyLiked = true;
              }
            });

            item?.followJoinAvtivity?.map((user) => {
              if (user.userId === userID) {
                isAlreadyFollowed = user.isFollow;
                isAlreadyJoined = user.isJoin;
              }
            });
            return (
              <ItemActivityFanpage
                ItemActivity={item}
                index={index}
                isAlreadyFollowed={isAlreadyFollowed}
                isAlreadyJoined={isAlreadyJoined}
                isAlreadyLiked={isAlreadyLiked}
                detailItem={detailItem}
                fanpageId={fanpageId}
              />
            );
          })}
      </div>
      <div className="col-lg-3">
        <aside className="sidebar static right">
          <Game />
        </aside>
      </div>
    </div>
  );
}
