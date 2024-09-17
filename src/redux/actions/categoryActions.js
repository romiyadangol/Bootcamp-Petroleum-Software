export const ADD_CATEGORY = "ADD_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const FETCH_CATEGORY_REQUEST = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_FAILURE = "FETCH_CATEGORY_FAILURE";

export const fetchCategoryRequest = () => ({
  type: FETCH_CATEGORY_REQUEST,
});

export const fetchCategorySuccess = (category) => ({
  type: FETCH_CATEGORY_SUCCESS,
  payload: category,
});

export const fetchCategoryFailure = (error) => ({
  type: FETCH_CATEGORY_FAILURE,
  payload: error,
});

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  payload: category,
});

export const deleteCategory = (id) => ({
  type: DELETE_CATEGORY,
  payload: id,
});

export const updateCategory = (category) => ({
  type: UPDATE_CATEGORY,
  payload: category,
});
