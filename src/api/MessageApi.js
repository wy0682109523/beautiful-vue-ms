import request from '../utils/request';

//查询消息列表
export const getMessageList = () => {
    return request({
        url: 'v1/message/getMessageList',
        method: 'get'
    });
};

//查询消息详情
export const getMessageDetail = query => {
    return request({
        url: 'v1/message/getMessageDetail',
        method: 'post',
        data: query
    });
};

//更新消息
export const updateMessage = query => {
    return request({
        url: 'v1/message/updateMessage',
        method: 'post',
        data: query
    });
};

//更新消息列表
export const updateMessageList = query => {
    return request({
        url: 'v1/message/updateMessageList',
        method: 'post',
        data: query
    });
};

//删除消息列表
export const deleteMessageList = query => {
    return request({
        url: 'v1/message/deleteMessageList',
        method: 'post',
        data: query
    });
};