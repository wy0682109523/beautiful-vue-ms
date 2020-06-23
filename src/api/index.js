import request from '../utils/request';

//通过区域级别查询区域信息
export const getDistrictByDistrictLevel = query => {
    return request({
        url: 'v1/district/getDistrictByLevel',
        method: 'get',
        params: query
    });
};

//通过父级区域Id查询区域信息
export const getDistrictByParentDistrictId = query => {
    return request({
        url: 'v1/district/getDistrictByParentDistrictId',
        method: 'post',
        data: query
    });
};

//查询员工信息列表
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

//更新员工信息
export const updateStaff = query => {
    return request({
        url: 'v1/staff/updateStaff',
        method: 'post',
        data: query
    });
};

//新增员工信息
export const addStaff = query => {
    return request({
        url: 'v1/staff/addStaff',
        method: 'post',
        data: query
    });
};

//删除员工信息
export const deleteStaff = query => {
    return request({
        url: 'v1/staff/deleteStaff',
        method: 'post',
        data: query
    });
};

//删除员工信息列表
export const deleteStaffList = query => {
    return request({
        url: 'v1/staff/deleteStaffList',
        method: 'post',
        data: query
    });
};

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

//删除库存
export const deleteInventory = query => {
    return request({
        url: 'v1/inventory/deleteInventory',
        method: 'post',
        data: query
    });
};

//删除库存列表
export const deleteInventoryList = query => {
    return request({
        url: 'v1/inventory/deleteInventoryList',
        method: 'post',
        data: query
    });
};

//查询商品列表
export const getGoodsList = query => {
    return request({
        url: 'v1/goods/getGoodsList',
        method: 'post',
        data: query
    });
};

//更新商品
export const updateGoods = query => {
    return request({
        url: 'v1/goods/updateGoods',
        method: 'post',
        data: query
    });
};

//删除商品
export const deleteGoods = query => {
    return request({
        url: 'v1/goods/deleteGoods',
        method: 'post',
        data: query
    });
};

//删除商品列表
export const deleteGoodsList = query => {
    return request({
        url: 'v1/goods/deleteGoodsList',
        method: 'post',
        data: query
    });
};

//添加商品
export const addGoods = query => {
    return request({
        url: 'v1/goods/addGoods',
        method: 'post',
        data: query
    });
};

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