let ad = '';
if (localStorage.getItem('admin')) {
    ad = localStorage.getItem('admin')
}

const stateDefault = {
    userByID: {},
    userByStatis: {},
    admin: ad,
    usertotal: "",
    userSchedule:[],
    arrListUser:[],
    arrNoti:[]
}


export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {


        case 'GET_USER_BY_STATIS': {
            state.userByStatis = action.userByStatis;
            state.usertotal = action.usertotal;
            return { ...state }
        }
        case 'LOGOUT_ADMIN': {
            state.admin = action.admin;
            return { ...state }
        }

        case 'GET_USER_SCHEDULE': {
            state.userSchedule = action.userSchedule;
            return { ...state }
        }
        case 'GET_LIST_USER': {
            state.arrListUser = action.arrListUser;
            return { ...state }
        }
        case 'GET_NOTI': {
            state.arrNoti = action.arrNoti;
            return { ...state }
        }
        default: return state;
    }
}