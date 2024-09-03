import { ADD_PRODUCT, DELETE_PRODUCT } from "../actions/productActions";

const initialState = [
    { name: 'Petrol', category: 'Fuel', status: 'Active', unit: 'Gallon' },
    { name: 'Diesel', category: 'Fuel', status: 'Active', unit: 'Litre' },
    { name: 'Engine Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Gear Oil', category: 'Oil', status: 'Inactive', unit: 'Litre' },
    { name: 'Brake Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Coolant', category: 'Oil', status: 'Inactive', unit: 'Litre' },
    { name: 'Power Steering Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Transmission Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Hydraulic Oil', category: 'Oil', status: 'Inactive', unit: 'Litre' },
    { name: 'Grease', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Washer Fluid', category: 'Oil', status: 'Inactive', unit: 'Litre' },
    { name: 'Battery Water', category: 'Oil', status: 'Active', unit: 'Litre' },
    { name: 'Distilled Water', category: 'Oil', status: 'Inactive', unit: 'Litre' },
];

const productReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_PRODUCT: 
            return [...state, action.payload];
        case DELETE_PRODUCT:
            return state.filter(product => 
                !(product.name === action.payload.name &&
                  product.category === action.payload.category &&
                  product.unit === action.payload.unit)
            );
        default:
            return state;
    }
}

export default productReducer;