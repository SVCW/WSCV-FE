import { http } from "../../utils/reponse";
import { GetListActivityAction } from "./ActivityAction";
import { VNPayAction } from "./VNPayAction";

export const DonationAction = (value,openPopup) => {
  return async (dispatch) => {
    try {
      let result = await http.post("/Donation/create-Donation-activity", value);
      const action = GetListActivityAction();
      dispatch(action);
      const action1 = VNPayAction(result.data.data?.donationId);
      dispatch(action1);
      const action2 = {
        type: "DONATE",
        message: "",
      };
      dispatch(action2);
      openPopup()
    } catch (error) {
      console.log(error);
      const action2 = {
        type: "DONATE",
        message: error.response?.data?.message,
      };
      dispatch(action2);
    }
  };
};

export const HistoryDonationAction = (value) => {
  return async (dispatch) => {
    try {
      let result = await http.get("/Donation/get-Donation-User?id=" + value);
      const action = {
        type: "GET_LIST_HISTORYDONATION",
        arrDonation: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
export const ListHistoryDonationAction = () => {
  return async (dispatch) => {
    try {
      let result = await http.get("/Donation/get-Donation");
      const action = {
        type: "GET_LIST_DONATION_DONE",
        arrDonationDone: result.data.data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
};
