import { ADD_CUSTOMER, DELETE_CUSTOMER } from "../actions/customerActions";

const initialState = [
    { name: 'Ram', phone: '1234567890', email: 'user1@gmail.com', address: 'Dallas, Texas', status: 'Active', city: 'Dallas', zip: '75001' },
    { name: 'Hari', phone: '1234567890', email: 'user2@gmail.com', address: 'Kathmandu, Nepal', status: 'InActive', city: 'Kathmandu', zip: '44600' },
];

const customerReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_CUSTOMER:
            return [...state, action.payload];
        case DELETE_CUSTOMER:
            return state.filter(customer => 
                !(customer.name === action.payload.name &&
                customer.category === action.payload.category &&
                customer.unit === action.payload.unit)
            );
        default:
            return state;
    }
}
export default customerReducer;