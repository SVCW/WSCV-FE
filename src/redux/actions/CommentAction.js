import { http } from "../../utils/reponse";
import { GetActivityIDAction, GetListActivityAction, GetListEndActivityAction, GetListEndActivityByUserIDAction } from "./ActivityAction";
import { GetFanpageByIDAction } from "./FanpageAction";
import { GetProfileByIdAction } from "./ProfileAction";

export const CommentAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/comment', value);
            const action = GetListActivityAction();
            dispatch(action)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'))
            dispatch(action2)
            const action3 = GetActivityIDAction(value.activityId);
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action5 = GetListEndActivityAction();
            dispatch(action5)
            const action8 = GetListEndActivityByUserIDAction(value.userId);
            dispatch(action8)
        } catch (error) {
            console.log(error);
        }
    }
}
export const CommentFanpageAction = (value, id) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/comment', value);
            const action = GetFanpageByIDAction(id);
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}


export const CommentRepllyAction = (value) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/reply-comment', value);
            const action = GetListActivityAction();
            dispatch(action)
            const action2 = GetProfileByIdAction(localStorage.getItem('useridprofile'))
            dispatch(action2)
            const action3 = GetActivityIDAction(value.activityId);
            dispatch(action3)
            const action4 = GetFanpageByIDAction(localStorage.getItem('fanpagedatail'));
            dispatch(action4)
            const action5 = GetListEndActivityAction();
            dispatch(action5)
            const action8 = GetListEndActivityByUserIDAction(value.userId);
            dispatch(action8)
        } catch (error) {
            console.log(error);
        }
    }
}
export const CommentRepllyFanpageAction = (value, id) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/Comment/reply-comment', value);
            const action = GetFanpageByIDAction(id);
            dispatch(action)
        } catch (error) {
            console.log(error);
        }
    }
}