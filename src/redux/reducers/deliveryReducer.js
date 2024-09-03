const initialState = [
    { pricing: '$1000', status: 'Active', created_at: '2024-09-01', type: 'Fuel', planned_at: '2024-09-05', customer: 'user 1', address: '123 Main St', state: 'CA', city: 'Los Angeles', zip: '90001' },
    { pricing: '$2000', status: 'Inactive', created_at: '2024-09-02', type: 'Oil', planned_at: '2024-09-06', customer: 'user 2', address: '456 Oak Ave', state: 'NY', city: 'New York', zip: '10001' },
];

const deliveryReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_DELIVERY':
            return [...state, action.payload]; 
        case 'DELETE_DELIVERY':
            return state.filter(delivery => 
                !(delivery.pricing === action.payload.pricing &&
                  delivery.customer === action.payload.customer )
            );
        default:
            return state;
    }
}
export default deliveryReducer;