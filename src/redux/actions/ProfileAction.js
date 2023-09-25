import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";
import { GetUserBystatisticAction } from "./UserAction";

export const GetProfileByIdAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-user-by-id?UserId=${id}`);
console.log(result.data.data.user.userId)
      const action = {
        type: "GET_USER_BY_ID",
        getUserId: result.data.data.user,
        arrActivityUser: result.data.data?.user?.activity,
      };
      localStorage.setItem(
        "getuserid",
        JSON.stringify(result.data?.data?.user)
      );
      localStorage.setItem(
        "useridprofile",
        result.data?.data?.user.userId
      );
      localStorage.setItem(
        "arrActivityUser",
        JSON.stringify(result.data.data?.user?.activity)
      );
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateProfileById = (userInfo) => {
  return async (dispatch) => {
    try {
      let result = await http.put("/User/update-user", {
        ...userInfo,
        gender: userInfo.gender === "Nam" ? true : false,
      });

      const action = {
        type: "GET_USER_BY_ID",
        getUserId: result.data.data.user,
      };
      localStorage.setItem(
        "getuserid",
        JSON.stringify(result.data?.data?.user)
      );
      dispatch(action);
      const action1 = GetUserBystatisticAction(localStorage.getItem("userID"));
      dispatch(action1);
      const action2 = GetListActivityAction();
      dispatch(action2);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CommentUserIdAction = (value, id) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/Comment/comment", value);
      console.log(result);
      const action = GetProfileByIdAction(id);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CommentRepllyFanpageAction = (value, id) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/Comment/reply-comment", value);
      console.log(result);
      const action = GetProfileByIdAction(id);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
