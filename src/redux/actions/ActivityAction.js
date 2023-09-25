import Swal from "sweetalert2";
import { http } from "../../utils/reponse";
import { GetFanpageByIDAction } from "./FanpageAction";
import { GetProfileByIdAction } from "./ProfileAction";
import { SendEmail } from "../../utils/emailService";
export const GetListActivityAction = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: "DISPLAY_LOADING" });
      let result = await http.get(
        "/Activity/get-activity?pageSize=30&PageLoad=1"
      );

      const action = {
        type: "GET_LIST_ACTIVITY",
        arrActivity: result.data.data.result,
      };
      dispatch(action);

      localStorage.setItem("activity", JSON.stringify(result.data.data.result));
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetActivityAction = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: "DISPLAY_LOADING" });
      let result = await http.get(
        "/Activity/get-activity?pageSize=5&PageLoad=1"
      );
      const action = {
        type: "GET_ACTIVITY",
        arrListActivity: result.data.data.result,
      };
      dispatch(action);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetListEndActivityAction = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: "DISPLAY_LOADING" });
      let result = await http.get("/Activity/get-activity-after-enddate");

      const action = {
        type: "GET_LIST_END_ACTIVITY",
        arrEndActivity: result.data.data,
      };
      dispatch(action);
      localStorage.setItem("endactivity", JSON.stringify(result.data.data));
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };
};
export const GetListEndActivityIDAction = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "DISPLAY_LOADING" });
      let result = await http.get(
        `/ActivityResult/get-activityresult-activity-v2?activityId=${id}`
      );

      const action = {
        type: "GET_LIST_END_ACTIVITY_ID",
        arrEndActivityID: result.data.data,
      };
      dispatch(action);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };
};
export const GetListEndActivityByUserIDAction = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "DISPLAY_LOADING" });
      let result = await http.get(
        `/Activity/get-activity-after-enddate-user?userId=${id}`
      );

      const action = {
        type: "GET_LIST_END_ACTIVITY_BY_USERID",
        arrEndActivityByUserID: result.data.data,
      };
      dispatch(action);
      localStorage.setItem("endactivity", JSON.stringify(result.data.data));
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };
};

export const CreateActivityAction = (value, setCreate) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/Activity/Insert-Activity", value);
      const action1 = {
        type: "CREATE_PROCEESS",
        activityProcess: result.data.data.activityId,
      };
      dispatch(action1);
      const action = GetListActivityAction();
      dispatch(action);
      const action5 = GetListEndActivityAction();
      dispatch(action5);
      const action3 =await GetProfileByIdAction(localStorage.getItem('userID'));
      dispatch(action3)
      localStorage.setItem("activityprocess", result.data.data.activityId);
      localStorage.setItem("activityprocessid", result.data.data.activityId);
      localStorage.setItem("startactivity", value.startDate);
      localStorage.setItem("endstart", value.endDate);
      setCreate(result.data.data.activityId);
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetActivityTitleAction = (value) => {
  return async (dispatch) => {
    try {
     
      let result = await http.post(`/Activity/get-activity-title`, value);
      const action = {
        type: "GET_LIST_ACTIVITY_TITLE",
        arrActivity: result.data.data,
      };
      console.log(result.data.data);
      dispatch(action);
      localStorage.setItem("activity", JSON.stringify(result.data.data));
      const search = {
        userId: localStorage.getItem("userID"),
        searchContent: value.search,
      };
      // const action1 = RecommentActivityAction(search, search.userId);
      // dispatch(action1);
      
    } catch (error) {
      console.log(error);
    }
  };
};
export const GetActivitySreachAction = (value) => {
  return async (dispatch) => {
    try {
     
      let result = await http.post(`/Activity/search`, value);
      console.log(result)
      const action = {
        type: "GET_LIST_ACTIVITY_SEARCH",
        arrActivitySearch: result.data.data,
      };
      console.log(result.data.data);
      dispatch(action);     
    } catch (error) {
      console.log(error);
    }
  };
};
export const GetActivityIDAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/Activity/get-activity-id?id=${value}`);
      const action = {
        type: "GET_ACTIVITY_BY_ID",
        activityById: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const PostLikeAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/Like/simple-like", value);
      const action = GetListActivityAction();
      dispatch(action);
      const action1 = GetListEndActivityAction();
      dispatch(action1);
      const action2 = GetProfileByIdAction(
        localStorage.getItem("useridprofile")
      );
      dispatch(action2);
      const action3 = GetActivityIDAction(value.activityId);
      dispatch(action3);
      const action4 = GetFanpageByIDAction(
        localStorage.getItem("fanpagedatail")
      );
      dispatch(action4);
      const action5 = GetListEndActivityAction();
      dispatch(action5);
    } catch (error) {
      console.log(error);
    }
  };
};

export const CheckinActivityAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(
        `/QR/check-in?userId=${value.userId}&activityId=${value.activityId}`
      );
      console.log(result);
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
        title: `Quét mã thành công.`,
      });
    } catch (error) {
      console.log(error?.response?.data?.message);
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
        icon: "warning",
        title: `${error?.response?.data?.message}`,
      });
    }
  };
};
export const DeleteLikeAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.delete("/Like/simple-unlike", {
        headers: {
          "Content-Type": "application/json",
        },
        data: value,
      });

      const action = GetListActivityAction();
      dispatch(action);
      const action1 = GetListEndActivityAction();
      dispatch(action1);
      const action2 = GetProfileByIdAction(
        localStorage.getItem("useridprofile")
      );
      dispatch(action2);
      const action3 = GetActivityIDAction(value.activityId);
      dispatch(action3);
      const action4 = GetFanpageByIDAction(
        localStorage.getItem("fanpagedatail")
      );
      dispatch(action4);
      const action5 = GetListEndActivityAction();
      dispatch(action5);
    } catch (error) {
      console.log(error);
    }
  };
};

export const ResultActivityAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(
        "/ActivityResult/Insert-activityresult",
        value
      );
      const action1 = GetListEndActivityAction();
      dispatch(action1);
      const action5 = GetListEndActivityAction();
      dispatch(action5);
    } catch (error) {
      console.log(error);
    }
  };
};

export const RefunActivityAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/VNPay/Refund-money?activityId=${id}`);
      const action1 = GetListActivityAction();
      dispatch(action1);
    } catch (error) {
      console.log(error);
    }
  };
};

export const DeleteActivityAction = (value ,email, title, username) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(`/Activity/delete-activity?id=${value}`);
      SendEmail(email, 'Bài viết của bãn đã bị xóa',   `<!DOCTYPE html>
      <html lang="vi">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1"> 
          <title>Chiến dịch đã bị xóa</title>
          <style>
              body {
                  font-family: Arial, sans-serif
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px
              }
      
              .header {
                  background-color: #18dcff;
                  color: #fff;
                  text-align: center;
                  padding: 10px
              }
      
              .content {
                  padding: 20px
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <div class="header">
                  <h1>Thư thông báo</h1>
              </div>
              <div class="content">
                  <p>Xin chào <span style="font-weight: 800">${username}</span>,</p>
                  <p>Thông báo chiến dịch đã bị xóa!</p>
                  <p>Bài viết <span style="font-weight: 800">${title}</span> đã bị xóa khỏi SVCW  <span style="font-weight: 800">.</p>
                  <p>Bạn vui lòng xem lại nội dung phù hợp với cộng đồng trên SVCW.</p>
                  <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>
                  <p>Trân trọng,<br>SVCW</p>
              </div>
          </div>
      </body>            
      `)
      const action1 = GetListActivityAction();
      dispatch(action1);
      const action5 = GetListEndActivityAction();
      dispatch(action5);
      
      // const action = RefunActivityAction(value);
      // dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const DeleteActivityByUserAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.delete(
        `/Activity/delete-activity-user?id=${value}`
      );
      const action1 = GetListActivityAction();
      dispatch(action1);
      const action = GetProfileByIdAction(localStorage.getItem("userID"));
      dispatch(action);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetActivityByIDAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/Activity/get-activity-id?id=${value}`);
      const action = {
        type: "GET_ACTIVITY_ID",
        activityId: result.data.data,
      };
      localStorage.setItem("activityID", result.data.data);
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateActivityAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.put(`/Activity/update-activity`, value);
      const action1 = GetListActivityAction();
      dispatch(action1);
      const action = GetProfileByIdAction(localStorage.getItem("userID"));
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetActivityLoginAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/Activity/get-activity-login-page`);
      const action = {
        type: "GET_ACTIVITY_LOGIN",
        arrActivityLogin: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetRecommentActivityAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(
        `/UserSearch/recommend-activity?userId=${id}`
      );

      const action = {
        type: "GET_ACTIVITY_RECOMMENT",
        arrActivityRecomment: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const RecommentActivityAction = (value, id) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/UserSearch/create`, value);

      const action = GetRecommentActivityAction(id);
      dispatch(action);
      const action1 = GetListActivityAction();
      dispatch(action1);
    } catch (error) {
      console.log(error);
    }
  };
};
export const ActiveActivityAction = (id, email, fullname, activityName) => {
  return async (dispatch) => {
    try {
      let result = await http.put(
        `/Activity/active-activity-pending?activityId=${id}`
      );
      const action1 = GetListActivityAction();
      dispatch(action1);
      Swal.fire({
        title: "Thành công!",
     text: `Duyệt chiến dịch ${activityName} thành công`,
        icon: "success",
        confirmButtonText: "Thành công",
      });
      SendEmail(
        email,
        "Bài viết được duyệt thành công",
        `<!DOCTYPE html>
            <html lang="vi">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1"> 
                <title>Chúc Mừng Chiến Dịch Duyệt Thành Công</title>
                <style>
                    body {
                        font-family: Arial, sans-serif
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px
                    }
            
                    .header {
                        background-color: #18dcff;
                        color: #fff;
                        text-align: center;
                        padding: 10px
                    }
            
                    .content {
                        padding: 20px
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Chúc Mừng</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <span style="font-weight: 800">${fullname}</span>,</p>
                        <p>Chào mừng bạn đến với SVCW!</p>
                        <p>Bài viết <span style="font-weight: 800">${activityName}</span> đã được duyệt thành công và đăng trên trang chủ cộng đồng. Bạn đã trở thành một phần quan trọng của cộng đồng, và chúng tôi mong rằng bạn sẽ có những trải nghiệm thú vị và tìm kiếm được các hoạt động phù hợp.</p>
                        <p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại hãy  liên hệ với đội người hỗ trợ của chúng
                            tôi.</p>
                        <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>
                        <p>Trân trọng,<br>SVCW</p>
                    </div>
                </div>
            </body>            
            `
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const GetQRActivityAction = (id) => {
  return async (dispatch) => {
    try {
      let response = await http.get(`/QR/QR?activityId=${id}`, {
        responseType: "arraybuffer",
      });

      // Tạo một blob từ dữ liệu nhận được từ API
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);

      // Tạo một link để tải xuống tệp tin
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ma_QR.png"); // Đặt tên và định dạng tệp tin
      document.body.appendChild(link);
      link.click();

      // Thu hồi URL blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
};

export const RejectActivityAction = (value) => {
  return async (dispatch) => {
    try {
      let response = await http.post("/Activity/reject-Activity", value);
      const action = GetListActivityAction();
      dispatch(action);
      SendEmail(
        value.email,
        "Duyệt chiến dịch không thành công",
        `<!DOCTYPE html>
      <html lang="vi">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1"> 
          <title>Duyệt chiến dịch không thành công</title>
          <style>
              body {
                  font-family: Arial, sans-serif
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px
              }
      
              .header {
                  background-color: #18dcff;
                  color: #fff;
                  text-align: center;
                  padding: 10px
              }
      
              .content {
                  padding: 20px
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <div class="header">
                  <h1>Thư thông báo</h1>
              </div>
              <div class="content">
                  <p>Xin chào <span style="font-weight: 800">${value.username}</span>,</p>
                  <p>Chào mừng bạn đến với SVCW!</p>
                  <p>Bài viết <span style="font-weight: 800">${value.title}</span> không được duyệt thành công với lý do  <span style="font-weight: 800">${value.reasonReject}</span>.</p>
                  <p>Bạn vui lòng xem lại nội dung phù hợp với cộng đồng trên SVCW.</p>
                  <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>
                  <p>Trân trọng,<br>SVCW</p>
              </div>
          </div>
      </body>            
      `
      );

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
        title: `Gửi lý do đến người dùng thành công`,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const QuitActivityAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.post(`/Activity/quit-Activity`, value);
      const id = {
        activityId: value.activityId,
      };
      console.log(id);
      // const action = RefunActivityAction( value.activityId);
      // dispatch(action);
      const action1 = GetListActivityAction();
      dispatch(action1);
      const action2 = GetFanpageByIDAction(localStorage.getItem('userID'));
      dispatch(action2)
      const action3 = GetProfileByIdAction(localStorage.getItem('userID'));
      dispatch(action3)
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
        title: `Chiến dịch đã ngừng hoạt động`,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
