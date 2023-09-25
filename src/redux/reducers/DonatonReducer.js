const stateDefault = {
  arrDonation: [],
  message: "",
  arrDonationDone:[]
};

export const DonationReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case "GET_LIST_HISTORYDONATION": {
      state.arrDonation = action.arrDonation;
      return { ...state };
    }
    case "DONATE": {
      state.message = action.message;
      return { ...state };
    }
    case "GET_LIST_DONATION_DONE": {
      state.arrDonationDone = action.arrDonationDone;
      return { ...state };
    }
    default:
      return state;
  }
};
