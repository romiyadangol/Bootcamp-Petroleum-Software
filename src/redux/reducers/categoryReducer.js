import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
} from "../actions/categoryActions";

const initialState = {
  category: [],
  loading: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        category: action.payload,
      };
    case FETCH_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        category: [...state.category, action.payload],
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        category: state.category.filter(
          (category) => category.id !== action.payload
        ),
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        category: state.category.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    default:
      return state;
  }
};

export default categoryReducer;
