import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../actions/authActions';

const initialState = {
    user: null,
    loading: false,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload, 
                loading: false,
                error: null
            };

        case LOGOUT_SUCCESS:
            return {
                ...state,
                user: null, 
                loading: false,
                error: null
            };

        case LOGIN_FAILURE:
        case LOGOUT_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        default:
            return state;
    }
};

export default authReducer;
