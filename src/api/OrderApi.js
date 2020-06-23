import request from '../utils/request';

//查询订单列表
export const getOrderList = query => {
    return request({
        url: 'v1/order/getOrderList',
        method: 'post',
        data: query
    });
};

//删除订单
export const deleteOrder = query => {
    return request({
        url: 'v1/order/deleteOrder',
        method: 'post',
        data: query
    });
};

//删除订单列表
export const deleteOrderList = query => {
    return request({
        url: 'v1/order/deleteOrderList',
        method: 'post',
        data: query
    });
};

//创建订单
export const createOrder = query => {
    return request({
        url: 'v1/order/createOrder',
        method: 'post',
        data: query
    });
};