export const ADD_ASSET = 'ADD_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';

export const addAsset = (asset) => ({
    type: ADD_ASSET,
    payload: asset,
});

export const deleteAsset = (unique_id) => ({
    type: DELETE_ASSET,
    payload: unique_id,
})