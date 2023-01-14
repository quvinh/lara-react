import { combineReducers } from "redux";

import counter from "./counter";

const allReducers = combineReducers({
    counter,
    // add more reducers here
});

export default allReducers;
