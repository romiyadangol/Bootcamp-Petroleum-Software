export const ADD_DRIVER = 'ADD_DRIVER';
export const DELETE_DRIVER = 'DELETE_DRIVER';
export const UPDATE_DRIVER = 'UPDATE_DRIVER';
export const FETCH_DRIVERS_REQUEST = 'FETCH_DRIVERS_REQUEST';
export const FETCH_DRIVERS_SUCCESS = 'FETCH_DRIVERS_SUCCESS';
export const FETCH_DRIVERS_FAILURE = 'FETCH_DRIVERS_FAILURE';

export const fetchDriversRequest= () => ({
    type: FETCH_DRIVERS_REQUEST,
});

export const fetchDriversSuccess = (drivers) => ({
    type: FETCH_DRIVERS_SUCCESS,
    payload: drivers,
});

export const fetchDriversFailure = (error) => ({
    type: FETCH_DRIVERS_FAILURE,
    payload: error,
});

export const addDriver = (driver) => ({
    type: ADD_DRIVER,
    payload: driver
});

export const deleteDriver = (id) => ({
    type: DELETE_DRIVER,
    payload: id,
});

export const updateDriver = (driver) => ({
    type: UPDATE_DRIVER,
    payload: driver,
})