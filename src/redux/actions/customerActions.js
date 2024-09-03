export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';

export const addCustomer = (customer) => ({
    type: ADD_CUSTOMER,
    payload: customer
});

export const deleteCustomer = (name,category,unit) => ({
    type: DELETE_CUSTOMER,
    payload: name,category,unit
})