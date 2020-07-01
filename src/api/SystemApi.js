import request from '../utils/request';

//查询系统配置列表
export const getSystemList = query => {
    return request({
        url: 'v1/system/getSystemList',
        method: 'post',
        data: query
    });
};

//增加系统配置
export const addSystem = query => {
    return request({
        url: 'v1/system/addSystem',
        method: 'post',
        data: query
    });
};

//更新系统配置
export const updateSystem = query => {
    return request({
        url: 'v1/system/updateSystem',
        method: 'post',
        data: query
    });
};

//删除系统配置
export const deleteSystem = query => {
    return request({
        url: 'v1/system/deleteSystem',
        method: 'post',
        data: query
    });
};

//删除系统配置列表
export const deleteSystemList = query => {
    return request({
        url: 'v1/system/deleteSystemList',
        method: 'post',
        data: query
    });
};