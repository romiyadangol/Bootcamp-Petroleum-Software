import { ADD_DRIVER, DELETE_DRIVER } from "../actions/driverActions";

const initialState = [
    { name: 'Ram', phone: '1234567890', email: 'user1@gmail.com', address: 'Dallas, Texas', status: 'Active' },
    { name: 'Hari', phone: '1234567890', email: 'user2@gmail.com', address: 'Kathmandu, Nepal', status: 'InActive' },
];

const driverReducer = (state = initialState, action) => { 
    switch(action.type){
        case ADD_DRIVER:
            return [...state, action.payload]; 
        case DELETE_DRIVER:
            return state.filter(driver => 
                !(driver.name === action.payload.name &&
                  driver.phone === action.payload.phone &&
                  driver.email === action.payload.email)
            );
        default:
            return state;
    }
}
export default driverReducer;
