import { ADD_USER, DELETE_USER } from "../actions/userActions";

const initialState = [
    { name: 'User 1', phone: '1234567890', email: 'user1@gmail.com', role: 'dispatcher,admin', status: 'Active' },
    { name: 'User 2', phone: '1234567890', email: 'user2@gmail.com', role: 'accounting', status: 'InActive' },
];

const userReducer = (state = initialState, action) => { 
    switch(action.type){
        case ADD_USER:
            return [...state, action.payload]; 
        case DELETE_USER:
            return state.filter(user => 
                !(user.name === action.payload.name &&
                  user.category === action.payload.category &&
                  user.unit === action.payload.unit)
            );
        default:
            return state;
    }
}
export default userReducer;