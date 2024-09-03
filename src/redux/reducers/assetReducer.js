import { ADD_ASSET } from "../actions/assetActions";
import { DELETE_ASSET } from "../actions/assetActions";

const initialState = [
    { id: 1, asset_type: 'tank', name: 'Petroleum Storage Tank 1', unique_id: 'ba3af9bb-4871-4e49-879a-3a641db40912', status: 'Active' },
    { id: 2,  asset_type: 'tank-wagon', name: 'Crude Oil Tanker Wagon', unique_id: '0fdf9944-0370-4d0f-a348-d1941dedde20', status: 'Inactive' },
    { id: 3,  asset_type: 'truck', name: 'Fuel Delivery Truck 300', unique_id: 'f3b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b', status: 'Active' },
    { id: 4,  asset_type: 'trailer', name: 'Fuel Tank Trailer T100', unique_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', status: 'Inactive' },
    { id: 5,  asset_type: 'tank', name: 'Fuel Oil Tank A', unique_id: 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', status: 'Active' },
];

const assetReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_ASSET:
            return [...state, action.payload];
        case DELETE_ASSET:
            return state.filter(asset => asset.unique_id !== action.payload);
        default:
            return state;
    }
};
export default assetReducer;