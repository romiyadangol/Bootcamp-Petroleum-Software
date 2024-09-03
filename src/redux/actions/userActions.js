export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';

export const addUser = (user) => ({
    type: ADD_USER,
    payload: user
});

export const deleteUser = (name,category,unit) => ({
    type: DELETE_USER,
    payload: name,category,unit
});