import Swal from "sweetalert2";
import { http } from "../../utils/reponse";
import { GetActivityIDAction, GetListActivityAction, GetListEndActivityAction, GetListEndActivityByUserIDAction, GetRecommentActivityAction } from "./ActivityAction";
import { GetFanpageByIDAction } from "./FanpageAction";
import { GetProfile1ByIdAction, GetProfileByIdAction } from "./ProfileAction";
import { ScheduleUserAction } from "./UserAction";
import { SendEmail } from "../../utils/emailService";
import moment from "moment";

export const FollowAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Activity/follow-Activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = await GetListActivityAction();
            dispatch(action)
            const action1 = GetRecommentActivityAction(user);
            dispatch(action1)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'));
            dispatch(action2)
            const action9 = GetProfile1ByIdAction(localStorage.getItem('useridprofile1'));
            dispatch(action9)
            const action3 = GetActivityIDAction(activity)
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action7 = GetListEndActivityAction();
            dispatch(action7)
            const action8 = GetListEndActivityByUserIDAction(user);
            dispatch(action8)
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
                title: `Theo dõi chiến dịch thành công `,
              });
        } catch (error) {
            console.log(error.response?.data.message);
        }
    }
}


export const UnFollowAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Activity/unfollow-activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action =await GetListActivityAction();
            dispatch(action)
            const action1 = GetRecommentActivityAction(user);
            dispatch(action1)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'));
            dispatch(action2)
            const action3 = GetActivityIDAction(activity)
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action7 = GetListEndActivityAction();
            dispatch(action7)
            const action8 = GetListEndActivityByUserIDAction(user);
            dispatch(action8)
            const action9 = GetProfile1ByIdAction(localStorage.getItem('useridprofile1'));
            dispatch(action9)
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
                icon: "error",
                title: `Bỏ theo dõi chiến dịch thành công `,
              });
        } catch (error) {
            console.log(error);
        }
    }
}



export const JoinAction = (activity, user,title,location,startDate,endDate) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Activity/join-Activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);

            const action =await GetListActivityAction();
            dispatch(action)
            const action1 = GetRecommentActivityAction(user);
            dispatch(action1)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'));
            dispatch(action2)
            const action3 = GetActivityIDAction(activity)
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action7 = GetListEndActivityAction();
            dispatch(action7)
            const action8 = GetListEndActivityByUserIDAction(user);
            dispatch(action8)
            const action9 = ScheduleUserAction(user);
            dispatch(action9)
            const action6 = GetProfile1ByIdAction(localStorage.getItem('useridprofile1'));
            dispatch(action6)
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
                title: `Tham gia chiến dịch thành công`,
              });
              SendEmail(
                localStorage.getItem("emailuser"),
                "Thông báo thời gian địa điểm diễn ra chiến dịch",
                `<!DOCTYPE html>
                <html lang="vi">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1">
                    <title>Chúc Mừng! Tham Gia Chiến Dịch Thành Công</title>
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
                            <h1>Chúc Mừng! Tham Gia Chiến Dịch Thành Công</h1>
                        </div>
                        <div class="content">
                            <p>Xin chào,</p>
                            <p>Bạn đã tham gia chiến dịch <span
                                    style="font-weight: bold;">${title}</span> trên SVCW!</p>
                            <p>Chúng tôi rất vui mừng vì bạn đã tham gia vào chiến dịch của chúng tôi. Vui lòng đến địa chỉ <span style="font-weight: bold;">${
                                location
                            }</span> từ ngày <span style="font-weight: bold;">${moment(startDate).format(
                                "DD/MM/YYYY hh:mm A"
                              )}</span> đến ngày <span style="font-weight: bold;">${moment(endDate).format(
                                "DD/MM/YYYY hh:mm A"
                              )}</span> để tham gia chiến dịch.</p>
                            <p>Khi đến vui lòng truy cập vào đường liên kết để điểm danh: <a href="https://wscv-fe-wscv-fe.vercel.app/loginmobile">Student-Volunteer</a></p>
                            <p>Nếu bạn gặp bất kỳ khó khăn hoặc có câu hỏi, đừng ngần ngại liên hệ với chúng tôi qua địa chỉ hỗ trợ.
                                Chúng tôi sẽ sẵn sàng giúp đỡ bạn.</p>
                            <p>Chúc bạn có những trải nghiệm thú vị và thành công trong việc quản lý tổ chức của mình trên SVCW!</p>
                            <p>Trân trọng,<br>SVCW</p>
                        </div>
                    </div>
                </body>
                
                </html>`
              );
        } catch (error) {
            console.log(error.response?.data.message);
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
              title: `${error.response?.data.message}`,
            });
        }
    }
}
export const UnJoinAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Activity/disJoin-activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = await GetListActivityAction();
            dispatch(action)
            const action1 = GetRecommentActivityAction(user);
            dispatch(action1)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'));
            dispatch(action2)
            const action3 = GetActivityIDAction(activity)
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action7 = GetListEndActivityAction();
            dispatch(action7)
            const action8 = GetListEndActivityByUserIDAction(user);
            dispatch(action8)
            const action9 = ScheduleUserAction(user);
            dispatch(action9)
            const action6 = GetProfile1ByIdAction(localStorage.getItem('useridprofile1'));
            dispatch(action6)
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
                icon: "error",
                title: `Bỏ tham gia chiến dịch thành công`,
              });
        } catch (error) {
            console.log(error);
        }
    }
}