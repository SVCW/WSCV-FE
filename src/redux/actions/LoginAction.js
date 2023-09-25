import Swal from "sweetalert2";
import { history } from "../../App";
import { http } from "../../utils/reponse";
import { ConfigActivityAction } from "./ConfigActivityAction";

export const LoginUserAction = (value, props) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/User/validate-login-user`, value);
      const action = {
        type: "GET_USER_LOGIN",
        userLogin: result.data.data,
        userID: result.data.data.user?.userId,
      };
      dispatch(action);
      localStorage.setItem("userLogin", result.data.data.resultCode);
      localStorage.setItem("userID", result.data.data.user?.userId);
      localStorage.setItem("setError", result.data.data.resultMsg);

      if (result.data.data.resultCode === 104) {
        dispatch({
          type: "CHECH_LOGIN",
          data: "Emai không hợp lệ",
        });
      } else if (result.data.data.resultCode === -2) {
        dispatch({
          type: "CHECH_LOGIN",
          data: "Tài khoản của bạn đã bị khóa",
        });
      } else {
        dispatch({
          type: "CHECH_LOGIN",
          data: "",
        });
        const email = {
          email: result.data.data.user?.email,
        };
        const action = await ConfigActivityAction(email);
        dispatch(action);
        props.history.push("/home");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: `Đăng nhập thành công`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const LoginUserMobileAction = (value, props) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/User/validate-login-user`, value);
      const action = {
        type: "GET_USER_LOGIN_MOBILE",
        userIDMobile: result.data.data.user?.userId,
      };
      dispatch(action);
      localStorage.setItem("userIDMobile", result.data.data.user?.userId);

      if (result.data.data.resultCode === 104) {
        dispatch({
          type: "CHECH_LOGIN",
          data: "Emai không hợp lệ",
        });
      } else {
        dispatch({
          type: "CHECH_LOGIN",
          data: "",
        });
        const email = {
          email: result.data.data.user?.email,
        };
        const action = await ConfigActivityAction(email);
        dispatch(action);
        props.history.push("/homemobile");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const LoginModeratorAction = (value, props) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/Moderator/login`, value);

      const action = {
        type: "GET_MODERATOR_LOGIN",
        moderator: result.data.data,
        msgModerator: "",
      };
      dispatch(action);
      localStorage.setItem("admin", "moderator");
      const action1 = {
        type: "LOGOUT_ADMIN",
        admin: localStorage.setItem("admin", "moderator"),
      };
      dispatch(action);
      dispatch(action1);
      localStorage.setItem("moderator", JSON.stringify(result.data.data));

      props.history.push("/adminstatistical");
    } catch (error) {
      const action = {
        type: "CHECK_MODERATOR",
        msgModerator: error.response?.data?.message,
      };
      dispatch(action);
    }
  };
};
