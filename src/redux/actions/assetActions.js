export const ADD_ASSET = 'ADD_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';
export const FETCH_ASSETS_REQUEST = 'FETCH_ASSETS_REQUEST';
export const FETCH_ASSETS_SUCCESS = 'FETCH_ASSETS_SUCCESS';
export const FETCH_ASSETS_FAILURE = 'FETCH_ASSETS_FAILURE';

export const fetchAssetsRequest = () => ({
    type: FETCH_ASSETS_REQUEST,
});
export const fetchAssetsSuccess = (assets) => ({
    type: FETCH_ASSETS_SUCCESS,
    payload: assets,
});
export const fetchAssetsFailure = (error) => ({
    type: FETCH_ASSETS_FAILURE,
    payload: error,
});
export const addAsset = (asset) => ({
    type: ADD_ASSET,
    payload: asset,
});
export const deleteAsset = (id) => ({
    type: DELETE_ASSET,
    payload: id,
})