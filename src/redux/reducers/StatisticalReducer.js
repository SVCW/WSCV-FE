

const stateDefault = {
    arrStatical: JSON.parse(localStorage.getItem('statistical')),
    arrStaticaladmin: JSON.parse(localStorage.getItem('statistical_admin')),
    arrStaticalAdminDonate: JSON.parse(localStorage.getItem('statistical_admin_donate')),

}


export const StatisticalReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case 'GET_STATICAL': {
            state.arrStatical = action.arrStatical;
            return { ...state }
        }
        case 'GET_STATICAL_ADMIN': {
            state.arrStaticaladmin = action.arrStaticaladmin;
            return { ...state }
        }
        case 'GET_STATICAL_ADMIN_DONATE': {
            state.arrStaticalAdminDonate = action.arrStaticalAdminDonate;
            return { ...state }
        }
        default: return state;
    }
}