
let user = {}
let arr = []
let user1 = {}
let arr1 = []
if (localStorage.getItem('getuserid')) {
    user = JSON.parse(localStorage.getItem('getuserid'))
    arr = JSON.parse(localStorage.getItem('arrActivityUser'))
}
if (localStorage.getItem('getuserid1')) {
    user1 = JSON.parse(localStorage.getItem('getuserid1'))
    arr1 = JSON.parse(localStorage.getItem('arrActivityUser1'))
}
const stateDefault = {
    getUserId: user,
    arrActivityUser: arr,
    getUserId1: user1,
    arrActivityUser1: arr1
}


export const ProfileReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_USER_BY_ID': {
            state.getUserId = action.getUserId;
            state.arrActivityUser = action.arrActivityUser;
            return { ...state }
        }
        case 'GET_USER_BY_ID_1': {
            state.getUserId1 = action.getUserId1;
            state.arrActivityUser1 = action.arrActivityUser1;
            return { ...state }
        }

        default: return state;
    }
}