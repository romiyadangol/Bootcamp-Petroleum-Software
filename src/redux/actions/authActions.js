export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const loginUser = () => ({
    type: LOGIN_REQUEST,
});

export const loginUserSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

export const loginUserFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logoutUser = () => ({
    type: LOGOUT_REQUEST,
});

export const logoutUserSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

export const logoutUserFailure = (error) => ({
    type: LOGOUT_FAILURE,
    payload: error,
});
