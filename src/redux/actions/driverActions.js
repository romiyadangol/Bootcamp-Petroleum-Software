export const ADD_DRIVER = 'ADD_DRIVER';
export const DELETE_DRIVER = 'DELETE_DRIVER';

export const addDriver = (driver) => ({
    type: ADD_DRIVER,
    payload: driver
});

export const deleteDriver = (name,phone,email) => ({
    type: DELETE_DRIVER,
    payload: name,phone,email
});