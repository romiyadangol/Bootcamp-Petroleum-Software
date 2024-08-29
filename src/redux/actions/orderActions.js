export const createOrder = (orderDetails) => {
    return {
      type: "CREATE_ORDER",
      payload: orderDetails,
    };
};