import { http } from "../../utils/reponse";

export const GetListReportAction = () => {
    return async (dispatch) => {
        try {
            let result = await http.get('/Report/get-all-report');

            const action = {
                type: "GET_LIST_REPORTYPE",
                arrReport: result.data.data
            }
            dispatch(action)
            localStorage.setItem('reporttype', JSON.stringify(result.data.data))
        } catch (error) {
            console.log(error);
        }
    }
}

export const GetListReportByTypeAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/Report/get-all-report-by-type?reportType=${id}`);

            const action = {
                type: "GET_LIST_REPORT_BYID",
                arrReportByID: result.data.data
            }
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}

export const CreateReportAction = (id) => {
    return async (dispatch) => {
        try {
            let result = await http.post(`/Report/new-report`, id);

            const action = GetListReportAction()
            dispatch(action)

        } catch (error) {
            console.log(error);
        }
    }
}