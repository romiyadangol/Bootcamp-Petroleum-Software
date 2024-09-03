export const ADD_PRODUCT = 'ADD_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const addProduct = (product) => ({
    type: ADD_PRODUCT,
    payload: product,
});

export const deleteProduct = (name,category,unit) => ({
    type: DELETE_PRODUCT,
    payload: name,category,unit,
});