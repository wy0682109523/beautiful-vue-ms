import request from '../utils/request';

//查询员工列表
export const getStaffList = query => {
    let sex = null;

    //替换查询参数
    if (query.sex === '女') {
        sex = 0;
    }

    if (query.sex === '男') {
        sex = 1;
    }

    if (query.sex === '未知') {
        sex = 2;
    }

    return request({
        url: 'v1/staff/getStaffList',
        method: 'post',
        data: {
            staffName: query.staffName,
            sex: sex,
            adminFlag: query.adminFlag,
            offset: query.offset,
            limit: query.limit
        }
    });
};

//更新员工
export const updateStaff = query => {
    return request({
        url: 'v1/staff/updateStaff',
        method: 'post',
        data: query
    });
};

//新增员工
export const addStaff = query => {
    return request({
        url: 'v1/staff/addStaff',
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