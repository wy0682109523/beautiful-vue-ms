import request from '../utils/request';

//查询商品列表
export const getGoodsList = query => {
    return request({
        url: 'v1/goods/getGoodsList',
        method: 'post',
        data: query
    });
};

//更新商品
export const updateGoods = query => {
    return request({
        url: 'v1/goods/updateGoods',
        method: 'post',
        data: query
    });
};

//删除商品
export const deleteGoods = query => {
    return request({
        url: 'v1/goods/deleteGoods',
        method: 'post',
        data: query
    });
};

//删除商品列表
export const deleteGoodsList = query => {
    return request({
        url: 'v1/goods/deleteGoodsList',
        method: 'post',
        data: query
    });
};

//添加商品
export const addGoods = query => {
    return request({
        url: 'v1/goods/addGoods',
        method: 'post',
        data: query
    });
};