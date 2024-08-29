import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
    auth: authReducer,
});

const store = configureStore(rootReducer);

export default store;