import { ADD_DRIVER, DELETE_DRIVER, FETCH_DRIVERS_FAILURE, FETCH_DRIVERS_REQUEST, FETCH_DRIVERS_SUCCESS, UPDATE_DRIVER } from "../actions/driverActions";

const initialState = {
    drivers: [],
    loading: false,
    error: null,
};

const driverReducer = (state = initialState, action) => { 
    switch(action.type){
        case FETCH_DRIVERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_DRIVERS_SUCCESS:
            return {
                ...state,
                loading: false,
                drivers: action.payload,
            };
        case FETCH_DRIVERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ADD_DRIVER:
            return {
                ...state,
                drivers: [...state.drivers, action.payload],
            }
        case DELETE_DRIVER:
            return {
                ...state,
                drivers: state.drivers.filter(driver => driver.id !== action.payload),
            }
        case UPDATE_DRIVER:
            return {
                ...state,
                drivers: state.drivers.map(driver => driver.id === action.payload.id ? action.payload : driver),
            }
        default:
            return state;
    }
}
export default driverReducer;
