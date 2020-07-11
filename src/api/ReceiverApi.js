import request from '../utils/request';

//添加收货人
export const addReceiver = query => {
    return request({
        url: 'v1/receiver/addReceiver',
        method: 'post',
        data: query
    });
};

//获取收货人列表
export const getReceiverList = query => {
    return request({
        url: 'v1/receiver/getReceiverList',
        method: 'post',
        data: query
    });
};