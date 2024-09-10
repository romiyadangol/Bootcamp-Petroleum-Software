import { ADD_CUSTOMER_BRANCH, DELETE_CUSTOMER_BRANCH, FETCH_CUSTOMER_BRANCHES_ERROR, FETCH_CUSTOMER_BRANCHES_REQUEST, FETCH_CUSTOMER_BRANCHES_SUCCESS, UPDATE_CUSTOMER_BRANCH } from "../actions/customerBranchActions";

const initialState = {
    customerBranches: [],
    loading: false,
    error: null
    };

const customerBranchReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CUSTOMER_BRANCHES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_CUSTOMER_BRANCHES_SUCCESS:
            return {
                ...state,
                customerBranches: action.payload,
                loading: false,
                error: null
            };
        case FETCH_CUSTOMER_BRANCHES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case ADD_CUSTOMER_BRANCH:
            return {
                ...state,
                customerBranches: [...state.customerBranches, action.payload]
            };
        case DELETE_CUSTOMER_BRANCH:
            return {
                ...state,
                customerBranches: state.customerBranches.filter(customerBranch => customerBranch.id !== action.payload)
            };
        case UPDATE_CUSTOMER_BRANCH:
            return {
                ...state,
                customerBranches: state.customerBranches.map(customerBranch => customerBranch.id === action.payload.id ? action.payload : customerBranch)
            };
        default:
            return state;
    }
};

export default customerBranchReducer;