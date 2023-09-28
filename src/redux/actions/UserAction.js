import { baseURL, http } from "../../utils/reponse";

export const GetUserByIdAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-user-by-id?UserId=${id}`);
      const action = {
        type: "GET_USER_BY_ID",
        userByID: result.data.data.user,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const GetListUserAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-all-user`);
      const action = {
        type: "GET_LIST_USER",
        arrListUser: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const GetUserBystatisticAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-statistic-profile?userId=${id}`);
      const action = {
        type: "GET_USER_BY_STATIS",
        userByStatis: result.data.data,
        usertotal: result.data.data.total.slice(0, 4),
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const ScheduleUserAction = (id) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/User/get-personal-schedule?userId=${id}`);
      console.log(result);
      const action = {
        type: "GET_USER_SCHEDULE",
        userSchedule: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
      const action = {
        type: "GET_USER_SCHEDULE",
        userSchedule: [],
      };
      dispatch(action);
    }
  };
};

export const BanUserAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.put(`/User/ban-user`, value);
      console.log(result);
      const action = GetListUserAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UnBanUserAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.put(`/User/un-ban-user?userId=${value}`);
      console.log(result);
      const action = GetListUserAction();
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};


export const GetNotiUserAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.get(`/Notification/get-user-notis?userId=${value}`);
     const action = {
      type:"GET_NOTI",
      arrNoti : result.data.data
     }
     dispatch(action)
    } catch (error) {
      console.log(error);
    }
  };
};


export async function getListOfUsers(userIds) {
  if (!(userIds instanceof Array)) {
    return undefined;
  }
  const apiUrl = `${baseURL}/User/get-list-user`;
  const requestBody = userIds;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return [];
    }

    const dataBody = await response.json();
    // Handle the data here

    return dataBody.data;
  } catch (error) {
    // Handle any errors here
    console.log('Error:', error);
    return [];
  }
}