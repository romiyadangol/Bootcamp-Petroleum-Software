export const ADD_DELIVERY = 'ADD_DELIVERY';
export const DELETE_DELIVERY = 'DELETE_DELIVERY';

export const addDelivery = (delivery) => ({
    type: ADD_DELIVERY,
    payload: delivery
});

export const deleteDelivery = (pricing, customer) => ({
    type: DELETE_DELIVERY,
    payload: pricing, customer
});