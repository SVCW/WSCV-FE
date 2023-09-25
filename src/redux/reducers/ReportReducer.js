const stateDefault = {
    arrReport: JSON.parse(localStorage.getItem('repottype')),
    arrReportByID: []
}


export const ReportReducer = (state = stateDefault, action) => {
    switch (action.type) {

        case 'GET_LIST_REPORTYPE': {
            state.arrReport = action.arrReport;
            return { ...state }
        }
        case 'GET_LIST_REPORT_BYID': {
            state.arrReportByID = action.arrReportByID;
            return { ...state }
        }

        default: return state;
    }
}