let activity = ''
let activityprocess = []
let process = []
if (localStorage.getItem('activityprocess')) {
    activity = localStorage.getItem('activityprocess')
}
if (localStorage.getItem('activityprocess')) {
    activityprocess = localStorage.getItem('activityprocess')
}
if (JSON.parse(localStorage.getItem('processtype'))) {
    process = JSON.parse(localStorage.getItem('processtype'))
}
const stateDefault = {
    processType: process,
    activityProcess: '',
    processactivity: activityprocess
}


export const ProcessTypeReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_PROCESSTYPE': {
            state.processType = action.processType;
            return { ...state }
        }
        case 'CREATE_PROCEESS': {
            state.activityProcess = action.activityProcess;
            return { ...state }
        }
        case 'GET_PROCESS_ACTIVITY': {
            state.processactivity = action.processactivity;
            return { ...state }
        }
        default: return state;
    }
}