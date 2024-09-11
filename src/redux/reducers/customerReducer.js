import { ADD_CUSTOMER, DELETE_CUSTOMER, UPDATE_CUSTOMER, FETCH_CUSTOMERS_FAILURE, FETCH_CUSTOMERS_REQUEST, FETCH_CUSTOMERS_SUCCESS } from "../actions/customerActions";

const initialState = {
    customers: [],
    loading: false,
    error: null
};

const customerReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_CUSTOMERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                loading: false,
                customers: action.payload,
            };
        case FETCH_CUSTOMERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ADD_CUSTOMER:
            return {
                ...state,
                customers: [...state.customers, action.payload],
            };
        case DELETE_CUSTOMER:
            return {
                ...state,
                customers: state.customers.filter(customer => customer.id !== action.payload), 
            };
        case UPDATE_CUSTOMER:
            return {
                ...state,
                customers: state.customers.map(customer => customer.id === action.payload.id? action.payload : customer)
            };
        default:
            return state;
    }
}
export default customerReducer;