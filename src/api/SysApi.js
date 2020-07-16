import request from '../utils/request';

//员工登录
export const login = query => {
    return request({
        url: 'v1/sys/login',
        method: 'post',
        data: query
    });
};

//获取员工最新登录记录
export const getLastLoginRecord = query => {
    return request({
        url: 'v1/sys/getLastLoginRecord',
        method: 'post',
        data: query
    });
};