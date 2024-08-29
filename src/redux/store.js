import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import orderReducer from "./reducers/orderReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    order: orderReducer,
});

const store = configureStore(rootReducer);

export default store;