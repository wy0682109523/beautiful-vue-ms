import request from '../utils/request';

//添加批次
export const addLot = query => {
    return request({
        url: 'v1/goods/addLot',
        method: 'post',
        data: query
    });
};

//更新批次
export const updateLot = query => {
    console.log(query);
    return request({
        url: 'v1/goods/updateLot',
        method: 'post',
        data: query
    });
};