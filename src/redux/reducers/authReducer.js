const initialState = {
    isLoggedIn: false,
    email: "",
    role: "",
    error: "",
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                isLoggedIn: true,
                email: action.payload.email,
                role: action.payload.role,
                error: "",
            };
        case "LOGIN_FAILURE":
            return {
                ...state,
                error: action.payload.error,
            };
        case "LOGOUT":
            return {
                ...state,
                isLoggedIn: false,
                email: "",
                role: "",
                error: "",
            };
        default:
            return state;
    }
};

export default authReducer;