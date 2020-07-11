import request from '../utils/request';

//获取区域列表
export const getDistrictList = query => {
    return request({
        url: 'v1/district/getDistrictList',
        method: 'post',
        data: query
    });
};

//通过父级区域Id查询区域信息
export const getDistrictListByParentDistrictId = query => {
    return request({
        url: 'v1/district/getDistrictListByParentDistrictId',
        method: 'post',
        data: query
    });
};