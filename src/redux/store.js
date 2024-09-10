import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import orderReducer from "./reducers/orderReducer";
import assetReducer from "./reducers/assetReducer";
import productReducer from "./reducers/productReducer";
import userReducer from "./reducers/userReducer";
import customerReducer from "./reducers/customerReducer";
import customerBranchReducer from "./reducers/customerBranchReducer";
import deliveryReducer from "./reducers/deliveryReducer";
import driverReducer from "./reducers/driverReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    order: orderReducer,
    asset: assetReducer,
    product: productReducer,
    user: userReducer,
    customer: customerReducer,
    customerBranch: customerBranchReducer,
    delivery: deliveryReducer,
    driver: driverReducer
});

export default rootReducer;