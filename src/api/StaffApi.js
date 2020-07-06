import request from '../utils/request';

//查询员工列表
export const getStaffList = query => {
    return request({
        url: 'v1/staff/getStaffList',
        method: 'post',
        data: query
    });
};

//查询员工详情
export const getStaffDetail = query => {
    return request({
        url: 'v1/staff/getStaffDetail',
        method: 'post',
        data: query
    });
};

//添加员工
export const addStaff = query => {
    return request({
        url: 'v1/staff/addStaff',
        method: 'post',
        data: query
    });
};

//查询员工是否存在
export const exist = query => {
    return request({
        url: 'v1/staff/staffExist',
        method: 'post',
        data: query
    });
};

//删除员工
export const deleteStaff = query => {
    return request({
        url: 'v1/staff/deleteStaff',
        method: 'post',
        data: query
    });
};

//删除员工列表
export const deleteStaffList = query => {
    return request({
        url: 'v1/staff/deleteStaffList',
        method: 'post',
        data: query
    });
};

//员工登录
export const login = query => {
    return request({
        url: 'v1/staff/login',
        method: 'post',
        data: query
    });
};

//员工密码修改
export const changePassword = query => {
    return request({
        url: 'v1/staff/changePassword',
        method: 'post',
        data: query
    });
};