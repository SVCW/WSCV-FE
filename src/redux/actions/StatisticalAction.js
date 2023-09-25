import { http } from "../../utils/reponse";

export const GetStatisticalAction = (id, year) => {
    return async (dispatch) => {

        try {
            const months = [
                { name: 'Tháng 1', start: `${year}-01-01`, end: `${year}-01-31` },
                { name: 'Tháng 2', start: `${year}-02-01`, end: `${year}-02-28` },
                { name: 'Tháng 3', start: `${year}-03-01`, end: `${year}-03-31` },
                { name: 'Tháng 4', start: `${year}-04-01`, end: `${year}-04-30` },
                { name: 'Tháng 5', start: `${year}-05-01`, end: `${year}-05-31` },
                { name: 'Tháng 6', start: `${year}-06-01`, end: `${year}-06-30` },
                { name: 'Tháng 7', start: `${year}-07-01`, end: `${year}-07-31` },
                { name: 'Tháng 8', start: `${year}-08-01`, end: `${year}-08-31` },
                { name: 'Tháng 9', start: `${year}-09-01`, end: `${year}-09-30` },
                { name: 'Tháng 10', start: `${year}-10-01`, end: `${year}-10-31` },
                { name: 'Tháng 11', start: `${year}-11-01`, end: `${year}-11-30` },
                { name: 'Tháng 12', start: `${year}-12-01`, end: `${year}-12-31` }
            ];

            const allMonthsData = [];

            for (const month of months) {
                let result = await http.post(`/Statistical/statistical?userId=${id}&start=${month.start}&end=${month.end}`);
                const monthData = result.data.data;
                allMonthsData.push(monthData);
            }
            dispatch({
                type: "GET_STATICAL",
                arrStatical: allMonthsData,
            });
            localStorage.setItem('statistical', JSON.stringify(allMonthsData))
        } catch (error) {
            console.log(error);
        }
    }
}

export const GetStatisticalAdminAction = (year) => {
    return async (dispatch) => {

        try {
            const months = [
                { name: 'Tháng 1', start: `${year}-01-01`, end: `${year}-01-31` },
                { name: 'Tháng 2', start: `${year}-02-01`, end: `${year}-02-28` },
                { name: 'Tháng 3', start: `${year}-03-01`, end: `${year}-03-31` },
                { name: 'Tháng 4', start: `${year}-04-01`, end: `${year}-04-30` },
                { name: 'Tháng 5', start: `${year}-05-01`, end: `${year}-05-31` },
                { name: 'Tháng 6', start: `${year}-06-01`, end: `${year}-06-30` },
                { name: 'Tháng 7', start: `${year}-07-01`, end: `${year}-07-31` },
                { name: 'Tháng 8', start: `${year}-08-01`, end: `${year}-08-31` },
                { name: 'Tháng 9', start: `${year}-09-01`, end: `${year}-09-30` },
                { name: 'Tháng 10', start: `${year}-10-01`, end: `${year}-10-31` },
                { name: 'Tháng 11', start: `${year}-11-01`, end: `${year}-11-30` },
                { name: 'Tháng 12', start: `${year}-12-01`, end: `${year}-12-31` }
            ];

            const allMonthsData = [];

            for (const month of months) {
                let result = await http.post(`/Statistical/statistical-admin?start=${month.start}&end=${month.end}`);
                const monthData = result.data.data;
                allMonthsData.push(monthData);
            }
            dispatch({
                type: "GET_STATICAL_ADMIN",
                arrStaticaladmin: allMonthsData,
            });
            localStorage.setItem('statistical_admin', JSON.stringify(allMonthsData))
        } catch (error) {
            console.log(error);
        }
    }
}


export const GetStatisticalAdminDonateAction = (year) => {
    return async (dispatch) => {

        try {
            const months = [
                { name: 'Tháng 1', start: `${year}-01-01`, end: `${year}-01-31` },
                { name: 'Tháng 2', start: `${year}-02-01`, end: `${year}-02-28` },
                { name: 'Tháng 3', start: `${year}-03-01`, end: `${year}-03-31` },
                { name: 'Tháng 4', start: `${year}-04-01`, end: `${year}-04-30` },
                { name: 'Tháng 5', start: `${year}-05-01`, end: `${year}-05-31` },
                { name: 'Tháng 6', start: `${year}-06-01`, end: `${year}-06-30` },
                { name: 'Tháng 7', start: `${year}-07-01`, end: `${year}-07-31` },
                { name: 'Tháng 8', start: `${year}-08-01`, end: `${year}-08-31` },
                { name: 'Tháng 9', start: `${year}-09-01`, end: `${year}-09-30` },
                { name: 'Tháng 10', start: `${year}-10-01`, end: `${year}-10-31` },
                { name: 'Tháng 11', start: `${year}-11-01`, end: `${year}-11-30` },
                { name: 'Tháng 12', start: `${year}-12-01`, end: `${year}-12-31` }
            ];

            const allMonthsData = [];

            for (const month of months) {
                let result = await http.post(`/Statistical/statistical-donate?start=${month.start}&end=${month.end}`);
                const monthData = result.data.data;
                allMonthsData.push(monthData);
            }
            dispatch({
                type: "GET_STATICAL_ADMIN_DONATE",
                arrStaticalAdminDonate: allMonthsData,
            });
            localStorage.setItem('statistical_admin_donate', JSON.stringify(allMonthsData))
        } catch (error) {
            console.log(error);
        }
    }
}