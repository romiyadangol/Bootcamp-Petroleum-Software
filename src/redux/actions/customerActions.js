export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';

export const addCustomer = (customer) => ({
    type: ADD_CUSTOMER,
    payload: customer
});

export const deleteCustomer = (name,category,unit) => ({
    type: DELETE_CUSTOMER,
    payload: name,category,unit
});

export const updateCustomer = (customer) => ({
    type: UPDATE_CUSTOMER,
    payload: customer
}); 

export const fetchCustomersRequest = () => ({
    type: FETCH_CUSTOMERS_REQUEST,
});

export const fetchCustomersSuccess = (customers) => ({
    type: FETCH_CUSTOMERS_SUCCESS,
    payload: customers,
});

export const fetchCustomersFailure = (error) => ({
    type: FETCH_CUSTOMERS_FAILURE,
    payload: error,
});