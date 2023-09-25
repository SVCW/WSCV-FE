const stateDefault = {
    arrFanpage: JSON.parse(localStorage.getItem("arrFanpage")),
    fanpageId: localStorage.getItem('fanpageId'),
    fanpageActivity: []
}


export const FanpageReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_FANPAGE': {
            state.arrFanpage = action.arrFanpage;
            return { ...state }
        }
        case 'GET_FANPAGE_ID': {
            state.fanpageId = action.fanpageId;
            return { ...state }
        }

        default: return state;
    }
}