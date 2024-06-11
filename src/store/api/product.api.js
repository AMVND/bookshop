
import * as types from "../../constants/actionType";
export const getAllProductByPage = (offset, pageSize, field, title, categoryId) => {
    return (dispatch) => {
        dispatch(fetchProductsRequest());

        fetch(
            "product/api/paginationAndSort/" +
                offset +
                "/" +
                pageSize +
                "/" +
                field +
                "?" +
                new URLSearchParams({
                    title: title,
                    categoryId: categoryId,
                })
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                dispatch(fetchProductsSuccess(result.response.content));
                // Cập nhật các trạng thái khác (loading, totalElements, totalPages) nếu cần
            })
            .catch((error) => {
                dispatch(fetchProductsFailure(error));
            });
    };
};

//

export const fetchProductsRequest = () => {
    return {
        type: types.FETCH_PRODUCTS_REQUEST,
    };
};

export const fetchProductsSuccess = (products) => {
    return {
        type: types.FETCH_PRODUCTS_SUCCESS,
        payload: products,
    };
};

export const fetchProductsFailure = (error) => {
    return {
        type: types.FETCH_PRODUCTS_FAILURE,
        payload: error,
    };
};