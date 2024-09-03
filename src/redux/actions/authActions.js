export const login = (email, password) => {
    return(dispatch) => {
        if (email === "test@gmail.com" && password === "password") {
            dispatch ({
                type: "LOGIN_SUCCESS",
                payload: { email, role: "admin" }
            });
        }
        else {
            dispatch ({
                type: "LOGIN_FAILURE",
                payload: { error: "Invalid email or password" },
            });
        }
    };
};

export const logout = () => {
    
    return {
        type: "LOGOUT",
    };
};