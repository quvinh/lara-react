export const excelReducer = (state = [], action) => {
    switch (action.type) {
        case "INVENTORY":
            return action.payload;
        default:
            return state;
    }
};

export default excelReducer;
