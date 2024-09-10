export const ADD_CUSTOMER_BRANCH = 'ADD_CUSTOMER_BRANCH';
export const DELETE_CUSTOMER_BRANCH = 'DELETE_CUSTOMER_BRANCH';
export const UPDATE_CUSTOMER_BRANCH = 'UPDATE_CUSTOMER_BRANCH';
export const FETCH_CUSTOMER_BRANCHES_REQUEST = 'FETCH_CUSTOMER_BRANCHES_REQUEST';
export const FETCH_CUSTOMER_BRANCHES_SUCCESS = 'FETCH_CUSTOMER_BRANCHES_SUCCESS';
export const FETCH_CUSTOMER_BRANCHES_ERROR = 'FETCH_CUSTOMER_BRANCHES_ERROR';

export const addCustomerBranch = (customerBranch) => ({
    type: ADD_CUSTOMER_BRANCH,
    payload: customerBranch,
});

export const deleteCustomerBranch = (id) => ({
    type: DELETE_CUSTOMER_BRANCH,
    payload: id,
});

export const updateCustomerBranch = (customerBranch) => ({
    type: UPDATE_CUSTOMER_BRANCH,
    payload: customerBranch,
});

export const fetchCustomerBranchesRequest = () => ({
    type: FETCH_CUSTOMER_BRANCHES_REQUEST
});

export const fetchCustomerBranchesSuccess = (customerBranches) => ({
    type: FETCH_CUSTOMER_BRANCHES_SUCCESS,
    payload: customerBranches
});

export const fetchCustomerBranchesError = (error) => ({
    type: FETCH_CUSTOMER_BRANCHES_ERROR,
    payload: error
});
