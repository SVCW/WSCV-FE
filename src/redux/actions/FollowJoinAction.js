import Swal from "sweetalert2";
import { http } from "../../utils/reponse";
import { GetActivityIDAction, GetListActivityAction, GetListEndActivityAction, GetListEndActivityByUserIDAction, GetRecommentActivityAction } from "./ActivityAction";
import { GetFanpageByIDAction } from "./FanpageAction";
import { GetProfileByIdAction } from "./ProfileAction";
import { ScheduleUserAction } from "./UserAction";
import { SendEmail } from "../../utils/emailService";
import moment from "moment";

export const FollowAction = (activity, user) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Activity/follow-Activity?activityId=${activity}&userId=${user}`);
            console.log(result.data);
            const action = GetListActivityAction();
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
            const action = GetListActivityAction();
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

            const action = GetListActivityAction();
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
                "Thông báo thời gian diễn ra chiến dịch",
                `Bạn đã tham gia thành công chiến dịch ${title} . Vui lòng đến địa chỉ ${
                  location
                } từ ngày ${moment(startDate).format(
                  "DD/MM/YYYY hh:mm A"
                )} đến ngày ${moment(endDate).format(
                  "DD/MM/YYYY hh:mm A"
                )} để tham gia chiến dịch`
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
            const action = GetListActivityAction();
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