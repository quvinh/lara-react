import { combineReducers } from "redux";

import counter from "./counter";
import excel from "./excel";

const allReducers = combineReducers({
    counter,
    excel
});

export default allReducers;
