export const ADD_DELIVERY = 'ADD_DELIVERY';
export const DELETE_DELIVERY = 'DELETE_DELIVERY';
export const UPDATE_DELIVERY = 'UPDATE_DELIVERY';
export const FETCH_DELIVERIES_REQUEST = 'FETCH_DELIVERIES_REQUEST';
export const FETCH_DELIVERIES_SUCCESS = 'FETCH_DELIVERIES_SUCCESS';
export const FETCH_DELIVERIES_ERROR = 'FETCH_DELIVERIES_ERROR';

export const addDelivery = (order) => {
    console.log("insdie delver",order)
    return{
    type: ADD_DELIVERY,
    payload: order
}};

export const deleteDelivery = (id) => ({
    type: DELETE_DELIVERY,
    payload: id
});

export const updateDelivery = (order) => ({
    type: UPDATE_DELIVERY,
    payload: order
});

export const fetchDeliveriesRequest = () => ({
    type: FETCH_DELIVERIES_REQUEST
});

export const fetchDeliveriesSuccess = (orders) => ({
    type: FETCH_DELIVERIES_SUCCESS,
    payload: orders
});

export const fetchDeliveriesError = (error) => ({
    type: FETCH_DELIVERIES_ERROR,
    payload: error
});