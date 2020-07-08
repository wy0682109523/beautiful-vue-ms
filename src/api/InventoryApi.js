import request from '../utils/request';

//查询库存列表
export const getInventoryList = query => {
    return request({
        url: 'v1/inventory/getInventoryList',
        method: 'post',
        data: query
    });
};

//更新库存
export const updateInventory = query => {
    return request({
        url: 'v1/inventory/updateInventory',
        method: 'post',
        data: query
    });
};