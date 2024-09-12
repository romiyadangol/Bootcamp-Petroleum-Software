import { ADD_DELIVERY, DELETE_DELIVERY, UPDATE_DELIVERY, FETCH_DELIVERIES_REQUEST, FETCH_DELIVERIES_SUCCESS, FETCH_DELIVERIES_ERROR } from '../actions/deliveryActions';

const initialState = {
    orders: [],
    loading: false,
    error: null
};

const deliveryReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_DELIVERY:
            return {
                ...state,
                orders: [...state.orders, ...action.payload]
            };

        case DELETE_DELIVERY:
            return {
                ...state,
                orders: state.orders.filter(delivery => delivery.id !== action.payload)
            };

        case UPDATE_DELIVERY:
            return {
                ...state,
                orders: state.orders.map(delivery => delivery.id === action.payload.id ? action.payload : delivery)
            };

        case FETCH_DELIVERIES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_DELIVERIES_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null
            };

        case FETCH_DELIVERIES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        default:
            return state;
    }
}
export default deliveryReducer;