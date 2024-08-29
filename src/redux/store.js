import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    order: orderReducer,
});

export default rootReducer;