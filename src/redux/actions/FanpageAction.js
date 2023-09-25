import Swal from "sweetalert2";
import { http } from "../../utils/reponse";

export const GetListFanpageAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Fanpage/getall-fanpage');
           

            const action = {
                type: "GET_LIST_FANPAGE",
                arrFanpage: result.data.data
            }
            dispatch(action)
           
            localStorage.setItem('arrFanpage', JSON.stringify(result.data.data))
        } catch (error) {
            console.log(error);
        }
    }
}


export const CreateFanpageAction = (value, props) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Fanpage/Insert-fanpage', value);
           
            const action = GetListFanpageAction()
            dispatch(action)
            localStorage.setItem('isFanpage', true)
            props.history.push('/home')
        } catch (error) {
            console.log(error);
        }
    }
}

export const GetFanpageByIDAction = (id) => {
    return async (dispatch) => {
        try {
            dispatch({ type: "DISPLAY_LOADING" })
            let result = await http.get(`/Fanpage/get-fanpage-id?id=${id}`);
           
            const action = {
                type: "GET_FANPAGE_ID",
                fanpageId: result.data.data,
            }
            dispatch(action)
            localStorage.setItem('fanpageId', result.data.data)
            localStorage.setItem('fanpagedatail', result.data.data.fanpageId)
            dispatch({ type: "HIDE_LOADING" })
        } catch (error) {
            console.log(error);
            dispatch({ type: "HIDE_LOADING" })
        }
    }
}

export const UnFollowFanpageAction = (user, fanpage) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Fanpage/unfollow-fanpage?userId=${user}&fanpageId=${fanpage}`);
           
            const action = GetListFanpageAction()
            dispatch(action)
            // localStorage.setItem('isFanpage', true)
            // props.history.push('/home')
        } catch (error) {
            console.log(error);
        }
    }
}

export const FollowFanpageAction = (user, fanpage) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Fanpage/follow-fanpage?userId=${user}&fanpageId=${fanpage}`);
           
            const action = GetListFanpageAction()
            dispatch(action)
            // localStorage.setItem('isFanpage', true)
            // props.history.push('/home')
        } catch (error) {
            console.log(error);
        }
    }
}

export const UpdateStatusFanpageAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Fanpage/moderate-fanpage?id=${id}`);
           
            // const action = GetListFanpageAction()
            // dispatch(action)
            // localStorage.setItem('isFanpage', true)
            // props.history.push('/home')
            const action = GetListFanpageAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}
export const DeleteFanpageAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/Fanpage/delete-fanpage?id=${id}`);
           
            // const action = GetListFanpageAction()
            // dispatch(action)
            // localStorage.setItem('isFanpage', true)
            // props.history.push('/home')
            const action = GetListFanpageAction();
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}
export const UpdateFanpageAction = (value,id) => {
    return async (dispatch) => {
        try {
            let result = await http.put(`/Fanpage/update-fanpage`,value);
                     
            const action = GetFanpageByIDAction(id);
            dispatch(action)
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
                title: `Chỉnh sửa thành công tin thông tin Fanpage của bạn`,
              });
        } catch (error) {
            console.log(error);
        }
    }
}