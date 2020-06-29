import request from '../utils/request';

//查询购物车列表
export const getCartList = query => {
    return request({
        url: 'v1/cart/getCartList',
        method: 'post',
        data: query
    });
};

//添加购物车
export const addCart = query => {
    return request({
        url: 'v1/cart/addCart',
        method: 'post',
        data: query
    });
};

//更新购物车
export const updateCart = query => {
    return request({
        url: 'v1/cart/updateCart',
        method: 'post',
        data: query
    });
};

//删除购物车
export const deleteCart = query => {
    return request({
        url: 'v1/cart/deleteCart',
        method: 'post',
        data: query
    });
};

//删除购物车列表
export const deleteCartList = query => {
    return request({
        url: 'v1/cart/deleteCartList',
        method: 'post',
        data: query
    });
};