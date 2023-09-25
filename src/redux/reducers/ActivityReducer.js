let arrActivity1 = [];
if (JSON.parse(localStorage.getItem('activity'))) {
    arrActivity1 = JSON.parse(localStorage.getItem('activity'))
}

const stateDefault = {
    arrActivity: [],
    activityId: {},
    activityById: localStorage.getItem('activityID'),
    arrListActivity: [],
    arrActivityLogin: [],
    arrActivityRecomment: [],
    arrActivitySearch:[]
}


export const ActivityReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_ACTIVITY': {
            state.arrActivity = action.arrActivity;
            return { ...state }
        }
        case 'GET_LIST_ACTIVITY_TITLE': {
            state.arrActivity = action.arrActivity;
            return { ...state }
        }
        case 'GET_ACTIVITY_ID': {
            state.activityId = action.activityId;
            return { ...state }
        }
        case 'GET_ACTIVITY_BY_ID': {
            state.activityById = action.activityById;
            return { ...state }
        }
        case 'GET_ACTIVITY': {
            state.arrListActivity = action.arrListActivity;
            return { ...state }
        }
        case 'GET_ACTIVITY_LOGIN': {
            state.arrActivityLogin = action.arrActivityLogin;
            return { ...state }
        }
        case 'GET_ACTIVITY_RECOMMENT': {
            state.arrActivityRecomment = action.arrActivityRecomment;
            return { ...state }
        }
        case 'GET_LIST_ACTIVITY_SEARCH': {
            state.arrActivitySearch = action.arrActivitySearch;
            return { ...state }
        }

        default: return state;
    }
}