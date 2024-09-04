import { ADD_ASSET, DELETE_ASSET, FETCH_ASSETS_REQUEST, FETCH_ASSETS_SUCCESS, FETCH_ASSETS_FAILURE } from '../actions/assetActions';

const initialState = {
  assets: [],
  loading: false,
  error: null,
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ASSETS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        loading: false,
        assets: action.payload,
      };
    case FETCH_ASSETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_ASSET:
      return {
        ...state,
        assets: [...state.assets, action.payload],
      };
    case DELETE_ASSET:
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload), // Assuming 'id' is used to identify assets
      };
    default:
      return state;
  }
};

export default assetReducer;
