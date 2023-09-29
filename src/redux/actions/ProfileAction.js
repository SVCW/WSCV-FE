import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";
import { GetUserBystatisticAction } from "./UserAction";

export const GetProfileByIdAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-user-by-idv2?userId=${id}`);
      console.log(result.data.data.user.userId);
      const action = {
        type: "GET_USER_BY_ID",
        getUserId: result.data.data.user,
        arrActivityUser: result.data.data?.activity,
      };
      localStorage.setItem(
        "getuserid",
        JSON.stringify(result.data?.data?.user)
      );
      localStorage.setItem("useridprofile", result.data?.data?.user.userId);
      localStorage.setItem(
        "arrActivityUser",
        JSON.stringify(result.data.data?.activity)
      );
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const GetProfile1ByIdAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-user-by-idv2?userId=${id}`);
      console.log(result.data.data?.activity)
      const action = {
        type: "GET_USER_BY_ID_1",
        getUserId1: result.data.data.user,
        arrActivityUser1: result.data.data?.activity,
      };
      localStorage.setItem(
        "getuserid1",
        JSON.stringify(result.data?.data?.user)
      );
      localStorage.setItem("useridprofile1", result.data?.data?.user.userId);
      localStorage.setItem(
        "arrActivityUser1",
        JSON.stringify(result.data.data?.activity)
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
      const action3 = GetProfileByIdAction(localStorage.getItem("userID"));
      dispatch(action3)
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
